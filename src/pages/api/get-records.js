const { hasuraRequest } = require('../../util/hasura');

async function getRecords(req, res) {
    const data = await hasuraRequest({
        query: `
            query GetRecords {
                textRecords: text_records(order_by: {created_at: desc}) {
                    id
                    createdAt: created_at
                    text
                    title
                    type
                }
            }
        `,
        variables: {},
    });

    res.status(200).json({ records: data.textRecords });
}

exports.getRecords = getRecords;
export default getRecords;
