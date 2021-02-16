import { recordTypes } from '../../constants';
import TwilioSMSParser from './smsParser';

const TEST_CASES = [
    {
        title: 'single line > meditation lowercase',
        input: 'm30',
        expectedOutput: {
            title: 'Meditated for 30 minutes',
            text: '',
            type: recordTypes.meditation,
            raw: 'm30',
        },
    },
    {
        title: 'single line > meditation uppercase',
        input: 'M5',
        expectedOutput: {
            title: 'Meditated for 5 minutes',
            text: '',
            type: recordTypes.meditation,
            raw: 'M5',
        },
    },
    {
        title: 'single line > thought',
        input: "Is 20 chars the right cutoff for test messages? Let's see!",
        expectedOutput: {
            title: 'Thought',
            text: "Is 20 chars the right cutoff for test messages? Let's see!",
            type: recordTypes.thought,
            raw: "Is 20 chars the right cutoff for test messages? Let's see!",
        },
    },
    {
        title: 'single line > test',
        input: 'Foo bar',
        expectedOutput: {
            title: 'Foo bar',
            text: 'Foo bar',
            type: recordTypes.test,
            raw: 'Foo bar',
        },
    },
    {
        title: 'multi line > with NL',
        input: `AMRAP 20

- 5x pullups
- 10x pushups

Result: Sore.`,
        expectedOutput: {
            title: 'AMRAP 20',
            text: `- 5x pullups
- 10x pushups

Result: Sore.`,
            type: recordTypes.exercise,
            raw: `AMRAP 20

- 5x pullups
- 10x pushups

Result: Sore.`,
        },
    },
    {
        title: 'multi line > w/o NL',
        input: `3 mile run
Result: 25:12`,
        expectedOutput: {
            title: '3 mile run',
            text: 'Result: 25:12',
            type: recordTypes.exercise,
            raw: `3 mile run
Result: 25:12`,
        },
    },
];

const testFunc = ({ title, input, expectedOutput }) => {
    test(`TwilioSMSParser: ${title}`, () => {
        const parser = new TwilioSMSParser(input);
        const output = parser.parse();
        expect(output).toEqual(expectedOutput);
    });
};

TEST_CASES.forEach(testFunc);
