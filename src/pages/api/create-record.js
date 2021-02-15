const { hasuraRequest } = require('../../util/hasura');

async function createRecord(req, res) {
    const { title, text, raw, type } = JSON.parse(req.body);

    const variables = {
        title,
        text,
        raw,
    };
    if (type) {
        variables.type = type;
    }

    const data = await hasuraRequest({
        query: `
            mutation CreateRecord($text: String!, $title: String!, $raw: String!, $type: String) {
                insert_textRecords_one(object: {title: $title, text: $text, raw: $raw, type: $type}) {
                    id
                }
            }
        `,
        variables,
    });

    res.status(200).json({ data });
}

exports.createRecord = createRecord;
export default createRecord;
