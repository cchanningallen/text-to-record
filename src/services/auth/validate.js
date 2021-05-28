import { getSession } from 'next-auth/client';
import db from '../db';

async function validateRequest(req) {
    // Ensure user is authed
    const session = await getSession({ req });
    if (!session || !session.user || !session.user.email) {
        throw new Error('Request Validation Failed: Invalid session');
    }

    // Get user ID for authed user
    const user = await db.users.getByEmail(session.user.email);
    if (!user) {
        throw new Error(
            `Request Validation Failed: No user for email "${session.user.email}"`
        );
    }

    // Return user
    return { user, session };
}

async function validateClient() {
    const response = { user: null, session: null };
    const session = await getSession();
    response.session = session;

    // If no user email, just return session.
    if (!session || !session.user || !session.user.email) {
        return response;
    }

    // Otherwise, fetch user for session.
    const user = await db.users.getByEmail(session.user.email);
    response.user = user;

    return response;
}

export { validateClient, validateRequest };
