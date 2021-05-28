import { hasuraRequest, buildQueryInputs } from './hasura';
import { DBError } from './errors';

const GQL_DEFINITIONS = {
    identifier: 'String!',
    token: 'String!',
    expires: 'timestamptz!',
};

const GQL_RESPONSE = `
    id
    identifier
    token
    expires
`;

const GQL_FRAGMENTS = {
    create: ({ typeDef, inputDef }) => `
        mutation CreateVerificationRequest(${typeDef}) {
            verificationRequest: insert_verification_requests_one(object: {${inputDef}}) {
                ${GQL_RESPONSE}
            }
        }
    `,
    getOne: () => `
        query GetOneVerificationRequest($identifier: String!, $token: String!) {
            verificationRequests: verification_requests(limit: 1, where: {identifier: {_eq: $identifier}, token: {_eq: $token}}) {
                ${GQL_RESPONSE}
            }
        }
    `,
    delete: () => `
        mutation DeleteVerificationRequest($identifier: String!, $token: String!) {
            verificationRequests: delete_verification_requests(where: {identifier: {_eq: $identifier}, token: {_eq: $token}}) {
                returning {
                    ${GQL_RESPONSE}
                }
            }
        }
    `,
};

class Records {
    async create({ identifier, token, expires }) {
        const variables = {
            identifier,
            token,
            expires,
        };
        const queryInputs = buildQueryInputs(variables, GQL_DEFINITIONS);
        const query = GQL_FRAGMENTS.create(queryInputs);

        const { data, errors } = await hasuraRequest({ variables, query });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.verificationRequest;
    }

    async getOne({ identifier, token }) {
        const variables = { identifier, token };
        const query = GQL_FRAGMENTS.getOne();

        const { data, errors } = await hasuraRequest({ variables, query });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.verificationRequests[0];
    }

    async delete({ identifier, token }) {
        const variables = { identifier, token };
        const query = GQL_FRAGMENTS.delete();

        const { data, errors } = await hasuraRequest({ variables, query });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.verificationRequests.returning[0];
    }
}

export default new Records();
