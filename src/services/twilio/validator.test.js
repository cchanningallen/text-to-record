import TwilioValidator from './validator';

const TEST_CASES = [
    {
        title: 'valid',
        input: {
            body: {
                From: '+11112223333',
            },
        },
        expectedOutput: undefined,
    },
    {
        title: 'invalid',
        input: {
            body: {
                From: '+14248675309',
            },
        },
        expectedOutput: {
            message: 'Sender not approved',
        },
    },
];

const testFunc = ({ title, input, expectedOutput }) => {
    test(`TwilioValidator: ${title}`, () => {
        const validator = new TwilioValidator(input);
        const output = validator.validate();
        expect(output).toEqual(expectedOutput);
    });
};

TEST_CASES.forEach(testFunc);
