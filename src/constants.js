const recordTypes = {
    exercise: 'EXERCISE',
    test: 'TEST',
    meditation: 'MEDITATION',
    thought: 'THOUGHT',
};

const hasuraClaimsKey = 'https://hasura.io/jwt/claims';

const roles = {
    admin: 'admin',
    user: 'user',
};

export { recordTypes, hasuraClaimsKey, roles };
