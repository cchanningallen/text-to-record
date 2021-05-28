import moment from 'moment';
import { createHash } from 'crypto';
import { hasuraRequest, buildQueryInputs } from './hasura';
import { DBError } from './errors';

const GQL_ACCOUNT_RESPONSE = `
    id
    userID: user_id
    providerID: provider_id
    providerType: provider_type
    providerAccountID: provider_account_id
    compoundID: compound_id
    refreshToken: refresh_token
    accessToken: access_token
    accessTokenExpires: access_token_expires
`;

const GQL_DEFINITIONS = {
    user_id: 'Int!',
    provider_id: 'String!',
    provider_type: 'String!',
    provider_account_id: 'String!',
    compound_id: 'String!',
    refresh_token: 'String',
    access_token: 'String',
    access_token_expires: 'timestamptz',
};

const GQL_FRAGMENTS = {
    create: ({ typeDef, inputDef }) => `
        mutation CreateAccount(${typeDef}) {
            account: insert_accounts_one(object: {${inputDef}}) {
                ${GQL_ACCOUNT_RESPONSE}
            }
        }
    `,
};

class Accounts {
    async create({
        userID,
        providerID,
        providerType,
        providerAccountID,
        refreshToken,
        accessToken,
        accessTokenExpires,
    }) {
        const variables = {
            user_id: userID,
            provider_id: providerID,
            provider_type: providerType,
            provider_account_id: providerAccountID,
            compound_id: this._buildCompoundID({
                providerID,
                providerAccountID,
            }),
        };
        if (refreshToken) {
            variables.refresh_token = refreshToken;
        }
        if (accessToken) {
            variables.access_token = accessToken;
        }
        if (accessTokenExpires) {
            // Coerce to Postgres-required ISO timestamp
            variables.access_token_expires = moment(
                accessTokenExpires
            ).display();
        }
        const queryInputs = buildQueryInputs(variables, GQL_DEFINITIONS);
        const query = GQL_FRAGMENTS.create(queryInputs);

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.account;
    }

    // compoundID ensures there is only ever one account for a given provider
    // account ID.
    _buildCompoundID({ providerID, providerAccountID }) {
        return createHash('sha256')
            .update(`${providerID}:${providerAccountID}`)
            .digest('hex');
    }
}

export default new Accounts();
