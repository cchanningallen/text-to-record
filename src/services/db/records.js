import { hasuraRequest, buildQueryInputs } from './hasura';
import { DBError } from './errors';

/*
    This workaround is necessary because of how Hasura handles empty GQL field values
    that are non-nullable + default at the DB level: Instead of just using the default
    value, as expected, the API throws an error.
    TODO: Figure out a cleaner way to do this.
*/
const GQL_DEFINITIONS = {
    title: 'String!',
    raw: 'String!',
    text: 'String = ""',
    user_id: 'Int!',
    type: 'String!',
    created_at: 'timestamptz',
};

const GQL_RECORD_RESPONSE = `
    id
    createdAt: created_at
    text
    title
    type
    userID: user_id
`;

const GQL_FRAGMENTS = {
    get: () => `
        query GetRecords($user_id: Int!) {
            textRecords: text_records(order_by: {created_at: desc}, where: {user_id: {_eq: $user_id}}) {
                ${GQL_RECORD_RESPONSE}
            }
        }
    `,
    create: ({ typeDef, inputDef }) => `
        mutation CreateRecord(${typeDef}) {
            textRecord: insert_text_records_one(object: {${inputDef}}) {
                ${GQL_RECORD_RESPONSE}
            }
        }
    `,
};

class Records {
    async get({ userID }) {
        const { data, errors } = await hasuraRequest({
            query: GQL_FRAGMENTS.get(),
            variables: { user_id: userID },
        });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.textRecords;
    }

    async create({ title, text, raw, type, createdAt, userID }) {
        const variables = {
            title,
            raw,
            text,
            user_id: userID,
        };
        if (type) {
            variables.type = type;
        }
        if (createdAt) {
            variables.created_at = createdAt;
        }
        const query = GQL_FRAGMENTS.create(
            buildQueryInputs(variables, GQL_DEFINITIONS)
        );

        const { data, errors } = await hasuraRequest({
            query,
            variables,
        });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.insert_text_records_one;
    }
}

export default new Records();
