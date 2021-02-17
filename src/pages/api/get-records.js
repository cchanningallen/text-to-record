const { hasuraRequest } = require('../../util/hasura');

async function getRecords(req, res) {
    const data = await hasuraRequest({
        query: `
            query GetRecords {
                textRecords(order_by: {createdAt: desc}) {
                    id
                    createdAt
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
