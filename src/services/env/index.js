const isTest = () => process.env.NODE_ENV == 'test';

export default {
    isTest,
};
