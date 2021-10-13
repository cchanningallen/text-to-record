import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import jwt from 'jsonwebtoken';
import HasuraNextAuthAdapter from '../../../services/auth/hasuraNextAuthAdapter';
import { hasuraClaimsKey, roles } from '../../../constants';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
    // https://next-auth.js.org/configuration/providers
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must to install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    // database: process.env.DATABASE_URL,
    adapter: HasuraNextAuthAdapter(),

    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `jwt` is automatically set to `true` if no database is specified.
        jwt: true,

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `jwt: true` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
        // A secret to use for key generation (you should set this explicitly)
        secret: process.env.NEXTAUTH_SECRET,
        // Set to true to use encryption (default: false)
        // encryption: true,
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behaviour.
        encode: async ({ secret, token, maxAge }) => {
            const jwtClaims = {
                sub: token.sub.toString(),
                name: token.name,
                email: token.email,
                iat: Date.now() / 1000,
                exp: Math.floor(Date.now() / 1000) + maxAge,
                // NOTE: This code is WIP, and currently unused.
                // TODO: Fix this to allow direct GQL queries from the UI to
                // Hasura for auth'd users.
                [hasuraClaimsKey]: {
                    'x-hasura-allowed-roles': [roles.user, roles.admin],
                    'x-hasura-default-role': roles.user,
                    'x-hasura-role': roles.user,
                    'x-hasura-user-id': token.user_id,
                },
            };
            const encodedToken = jwt.sign(jwtClaims, secret, {
                algorithm: 'HS256',
            });
            return encodedToken;
        },
        decode: async ({ secret, token, maxAge }) => {
            const decodedToken = jwt.verify(token, secret, {
                algorithms: ['HS256'],
            });
            return decodedToken;
        },
    },

    // You can define custom pages to override the built-in pages.
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
        // signIn: '/api/auth/signin',  // Displays signin buttons
        // signOut: '/api/auth/signout', // Displays form with sign out button
        // error: '/api/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/api/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        // async signIn(user, account, profile) { return true },
        // async redirect(url, baseUrl) { return baseUrl },
        async jwt(token, user, account, profile, isNewUser) {
            // console.log('\n\t>> jwt', token, user, account, profile, isNewUser);
            const isUserSignedIn = user ? true : false;
            if (isUserSignedIn) {
                token.user_id = user.id.toString();
            }
            return token;
        },
        async session(session, token) {
            // console.log('\n\t>> session', session, token);
            const encodedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET, {
                algorithm: 'HS256',
            });
            session.user_id = token.user_id;
            session.token = encodedToken;
            return session;
        },
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    // Enable debug messages in the console if you are having problems
    debug: process.env.NEXT_AUTH_DEBUG_ENABLED,

    theme: 'light',
});
