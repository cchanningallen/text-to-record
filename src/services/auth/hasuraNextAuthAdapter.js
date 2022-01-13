import { createHash } from 'crypto';
import db from '../db';
import strings from '../../util/strings';

/* 
    Implementation borrows heavily from the TypeORM & Prisma example adapters.
    Details: https://github.com/nextauthjs/adapters/blob/canary/packages/
*/
export default function HasuraNextAuthAdapter() {
    async function getAdapter(appOptions) {
        /*
            These values are stored as seconds, but to use them with dates in
            JavaScript we convert them to milliseconds.
            
            Use a conditional to default to 30 day session age if not set - it 
            should always be set but a meaningful fallback is helpful to 
            facilitate testing.
        */
        if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
            _debug(
                'GET_ADAPTER',
                'Session expiry not configured (defaulting to 30 days'
            );
        }
        const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
        const sessionMaxAge =
            appOptions && appOptions.session && appOptions.session.maxAge
                ? appOptions.session.maxAge * 1000
                : defaultSessionMaxAge;
        const sessionUpdateAge =
            appOptions && appOptions.session && appOptions.session.updateAge
                ? appOptions.session.updateAge * 1000
                : 0;

        // Display debug output if debug option enabled
        function _debug(...args) {
            if (appOptions.debug) {
                console.log('[next-auth][debug]', ...args);
            }
        }

        // Store hashed token (using secret as salt) so that tokens cannot be exploited
        // even if the contents of the database are compromised.
        // @TODO Use bcrypt function here instead of simple salted hash
        function _buildHashedVerificationToken({ token, secret }) {
            return createHash('sha256')
                .update(`${token}${secret}`)
                .digest('hex');
        }

        async function createUser({ id, name, email, image }) {
            _debug('createUser', { id, name, email, image });
            return await db.users.create({
                name: strings.toTitleCase(name),
                email,
                image,
            });
        }

        async function getUser(id) {
            _debug('getUser', id);
            return await db.users.getByID(id);
        }

        async function getUserByEmail(email) {
            _debug('getUserByEmail', email);
            return await db.users.getByEmail(email);
        }

        async function getUserByProviderAccountId(
            providerID,
            providerAccountID
        ) {
            _debug('getUserByProviderAccountID', providerID, providerAccountID);
            return await db.users.getByProviderAccount(
                // Cast to strings to ensure DB values are always TEXT
                String(providerID),
                String(providerAccountID)
            );
        }

        async function updateUser(user) {
            _debug('updateUser', user);
            return await db.users.update(user);
        }

        async function deleteUser(userID) {
            _debug('deleteUser', userID);
            return await db.users.delete(userID);
        }

        async function linkAccount(
            userID,
            providerID,
            providerType,
            providerAccountID,
            refreshToken,
            accessToken,
            accessTokenExpires
        ) {
            const accountParams = {
                userID,
                providerID,
                providerType,
                providerAccountID: String(providerAccountID),
                refreshToken,
                accessToken,
                accessTokenExpires,
            };
            _debug('linkAccount', { accountParams });
            return await db.accounts.create(accountParams);
        }

        async function unlinkAccount(userID, providerID, providerAccountID) {
            _debug('unlinkAccount', userID, providerID, providerAccountID);
            return null; // Not implemented because not currently required.
        }

        async function createSession(user) {
            _debug('createSession', user);
            let expires = null;
            if (sessionMaxAge) {
                const dateExpires = new Date();
                dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
                expires = dateExpires;
            }
            return await db.sessions.create({ userID: user.id, expires });
        }

        async function getSession(sessionToken) {
            _debug('getSession', sessionToken);
            const session = await db.sessions.getBySessionToken(sessionToken);
            // Check session has not expired. If it has, delete session in
            // background and return null.
            if (
                session &&
                session.expires &&
                new Date() > new Date(session.expires)
            ) {
                db.sessions.deleteBySessionToken(sessionToken);
                return null;
            }
            return session;
        }

        async function updateSession({ id, expires, sessionToken }, force) {
            _debug('updateSession', { id, expires, sessionToken });
            if (
                sessionMaxAge &&
                (sessionUpdateAge || sessionUpdateAge === 0) &&
                expires
            ) {
                // Calculate last updated date, to throttle write updates to database
                // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
                //     e.g. ({expiry date} - 30 days) + 1 hour
                //
                // Default for sessionMaxAge is 30 days.
                // Default for sessionUpdateAge is 1 hour.
                const dateSessionIsDueToBeUpdated = new Date(expires);
                dateSessionIsDueToBeUpdated.setTime(
                    dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge
                );
                dateSessionIsDueToBeUpdated.setTime(
                    dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge
                );

                // Trigger update of session expiry date and write to database, only
                // if the session was last updated more than {sessionUpdateAge} ago
                if (new Date() > dateSessionIsDueToBeUpdated) {
                    const newExpiryDate = new Date();
                    newExpiryDate.setTime(
                        newExpiryDate.getTime() + sessionMaxAge
                    );
                    expires = newExpiryDate;
                } else if (!force) {
                    return null;
                }
            } else {
                // If session MaxAge, session UpdateAge or session.expires are
                // missing then don't even try to save changes, unless force is set.
                if (!force) {
                    return null;
                }
            }
            return await db.sessions.update({ id, expires });
        }

        async function deleteSession(sessionToken) {
            _debug('deleteSession', sessionToken);
            return await db.sessions.deleteBySessionToken(sessionToken);
        }

        async function createVerificationRequest(
            identifier,
            url,
            token,
            secret,
            provider
        ) {
            _debug('createVerificationRequest', identifier);
            const baseURL = (appOptions && appOptions.baseURL) || '';
            const { sendVerificationRequest, maxAge } = provider;

            const hashedToken = _buildHashedVerificationToken({
                token,
                secret,
            });

            let expires = '';
            if (maxAge) {
                const dateExpires = new Date();
                dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
                expires = dateExpires.toISOString();
            }

            // Persist
            const verificationRequest = db.verificationRequests.create({
                identifier,
                token: hashedToken,
                expires,
            });

            // With the verificationCallback on a provider, you can send an email, or queue
            // an email to be sent, or perform some other action (e.g. send a text message)
            await sendVerificationRequest({
                identifier,
                url,
                token,
                baseUrl,
                provider,
            });

            return verificationRequest;
        }

        async function getVerificationRequest(
            identifier,
            token,
            secret,
            provider
        ) {
            _debug('getVerificationRequest', identifier, token);
            const hashedToken = _buildHashedVerificationToken({
                token,
                secret,
            });
            const verificationRequests = await db.verificationRequests.getOne({
                identifier,
                token: hashedToken,
            });

            if (
                verificationRequest &&
                verificationRequest.expires &&
                new Date() > verificationRequest.expires
            ) {
                await db.verificationRequests.delete({
                    identifier,
                    token: hashedToken,
                });
                return null;
            }

            return verificationRequest;
        }

        async function deleteVerificationRequest(
            identifier,
            token,
            secret,
            provider
        ) {
            _debug('deleteVerification', identifier, token);
            // Delete verification entry so it cannot be used again
            const hashedToken = _buildHashedVerificationToken({
                token,
                secret,
            });
            return await db.verificationRequests.delete({
                identifier,
                token: hashedToken,
            });
        }

        return {
            createUser,
            getUser,
            getUserByEmail,
            getUserByProviderAccountId,
            updateUser,
            deleteUser,
            linkAccount,
            unlinkAccount,
            createSession,
            getSession,
            updateSession,
            deleteSession,
            createVerificationRequest,
            getVerificationRequest,
            deleteVerificationRequest,
        };
    }

    return {
        getAdapter,
    };
}
