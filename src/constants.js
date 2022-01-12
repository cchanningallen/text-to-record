const recordTypes = {
    exercise: 'EXERCISE',
    test: 'TEST',
    meditation: 'MEDITATION',
    thought: 'THOUGHT',
    notion: 'NOTION',
    quote: 'QUOTE',
};

const hasuraClaimsKey = 'https://hasura.io/jwt/claims';

const roles = {
    admin: 'admin',
    user: 'user',
};

export { recordTypes, hasuraClaimsKey, roles };
