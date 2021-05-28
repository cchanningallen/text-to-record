const fetch = require('node-fetch');

// Returns { ?data: {}, ?errors: [{ message: String, ... }] }
// Expects caller to handle errors
async function hasuraRequest({ query, variables }) {
    const result = await fetch(process.env.HASURA_URL, {
        method: 'POST',
        headers: {
            'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify({ query, variables }),
    }).then((res) => res.json());

    console.log(result);
    // Error checks. Errors are bubbled up.
    if (!result) return { errors: [{ message: '[Hasura] Error: No result' }] };
    if (result.errors) return result;
    if (!result.data) {
        return {
            errors: [{ message: '[Hasura] Error: No result data' }],
            ...result,
        };
    }

    return result;
}

function buildQueryInputs(variables, gqlDefs) {
    // Filter in case any variables don't have explicit types.
    const varNames = Object.keys(variables).filter((name) => !!gqlDefs[name]);

    // Produces eg '$title: String!, $text: String!'
    const typeDef = varNames
        .map((name) => `$${name}: ${gqlDefs[name]}`)
        .join(', ');

    // Produces eg 'title: $title, text: $text'
    const inputDef = varNames.map((name) => `${name}: $${name}`).join(', ');

    return { typeDef, inputDef };
}

export { hasuraRequest, buildQueryInputs };
