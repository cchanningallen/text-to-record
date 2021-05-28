import moment from 'moment';
import { randomBytes } from 'crypto';
import { hasuraRequest, buildQueryInputs } from './hasura';
import { DBError } from './errors';

// TODO: Consider migrating to a cache-based strategy. IOPS on our DB will get
// expensive eventually.

const GQL_SESSION_RESPONSE = `
    id
    userID: user_id
    expires
    sessionToken: session_token
    accessToken: access_token
`;

const GQL_DEFINITIONS = {
    user_id: 'Int!',
    expires: 'timestamptz!',
    session_token: 'String!',
    access_token: 'String!',
    updated_at: 'timestamptz!',
};

const GQL_FRAGMENTS = {
    create: ({ typeDef, inputDef }) => `
        mutation CreateSession(${typeDef}) {
            session: insert_sessions_one(object: {${inputDef}}) {
                ${GQL_SESSION_RESPONSE}
            }
        }
    `,
    update: ({ typeDef, inputDef }) => `
        mutation UpdateSession($id: Int!, ${typeDef}) {
            session: update_sessions_by_pk(pk_columns: {id: $id}, _set: {${inputDef}}) {
                ${GQL_SESSION_RESPONSE}
            }
        }
    `,
    getBySessionToken: () => `
        query GetBySessionToken($session_token: String!) {
            sessions(limit: 1, where: {session_token: {_eq: $session_token}}) {
                ${GQL_SESSION_RESPONSE}
            }
        }
    `,
    deleteBySessionToken: () => `
        mutation DeleteBySessionToken($session_token: String!) {
            sessions: delete_sessions(where: {session_token: {_eq: $session_token}}) {
                returning {
                    ${GQL_SESSION_RESPONSE}
                }
            }
        }
    `,
};

class Sessions {
    async create({ userID, expires }) {
        const variables = {
            user_id: userID,
            // Coerce to Postgres-required ISO timestamp
            expires: moment(expires).format(),
            session_token: this._buildToken(),
            access_token: this._buildToken(),
        };
        const queryInputs = buildQueryInputs(variables, GQL_DEFINITIONS);
        const query = GQL_FRAGMENTS.create(queryInputs);
        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));
        return data.session;
    }

    async update({ id, expires }) {
        const variables = {
            id,
            // Coerce to Postgres-required ISO timestamp
            expires: moment(expires).format(),
            updated_at: moment().format(),
        };
        const queryInputs = buildQueryInputs(variables, GQL_DEFINITIONS);
        const query = GQL_FRAGMENTS.create(queryInputs);

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.session;
    }

    async getBySessionToken(sessionToken) {
        const variables = { session_token: sessionToken };
        const query = GQL_FRAGMENTS.getBySessionToken();

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.sessions[0];
    }

    async deleteBySessionToken(sessionToken) {
        const variables = { session_token: sessionToken };
        const query = GQL_FRAGMENTS.deleteBySessionToken();

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.sessions.returning[0];
    }

    _buildToken() {
        return randomBytes(32).toString('hex');
    }
}

export default new Sessions();
