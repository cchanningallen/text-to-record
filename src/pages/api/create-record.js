const { hasuraRequest } = require('../../util/hasura');

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
    type: 'String!',
    created_at: 'timestamptz',
};

async function createRecord(req, res) {
    const { title, text, raw, type, createdAt } = JSON.parse(req.body);
    console.log({ title, text, raw, type, createdAt });

    const variables = {
        title,
        raw,
        text,
    };
    if (type) {
        variables.type = type;
    }
    if (createdAt) {
        variables.created_at = createdAt;
    }

    const query = buildQuery(variables);

    const data = await hasuraRequest({
        query,
        variables,
    });

    res.status(200).json({ data });
}

function buildQuery(variables) {
    const varNames = Object.keys(variables);

    // Produces eg '$title: String!, $text: String!'
    const typeDef = varNames
        .map((name) => `$${name}: ${GQL_DEFINITIONS[name]}`)
        .join(', ');

    // Produces eg 'title: $title, text: $text'
    const inputDef = varNames.map((name) => `${name}: $${name}`).join(', ');

    return `
        mutation CreateRecord(${typeDef}) {
            insert_text_records_one(object: {${inputDef}}) {
                id
            }
        }
    `;
}

exports.createRecord = createRecord;
export default createRecord;
