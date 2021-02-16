import { recordTypes } from '../../constants';

const MATCHERS = {
    meditation: /^m(\d*)$/i,
};
const TEST_LINE_LENGTH_MAX = 20;

/*
    {
        title: String!,
        text: String!,
        raw: String!,
        type: String!,
    }
*/
export default class TwilioSMSParser {
    constructor(sms) {
        this._rawSMS = sms;
    }

    parse() {
        this._ingest();
        if (this._lines.length == 1) {
            return this._parseSingleLineSMS();
        }
        return this._parseMultiLineSMS();
    }

    _ingest() {
        this._lines = this._rawSMS.split('\n').map((l) => l.trim());
    }

    _parseSingleLineSMS() {
        const line = this._lines[0];

        const meditationMatch = line.match(MATCHERS.meditation);
        if (meditationMatch) {
            const duration = meditationMatch[1];

            return {
                title: `Meditated for ${duration} minutes`,
                text: '',
                raw: this._rawSMS,
                type: recordTypes.meditation,
            };
        }

        if (line.length > TEST_LINE_LENGTH_MAX) {
            return {
                title: 'Thought',
                text: line,
                raw: this._rawSMS,
                type: recordTypes.thought,
            };
        }

        return {
            title: line,
            text: line,
            raw: this._rawSMS,
            type: recordTypes.test,
        };
    }

    _parseMultiLineSMS() {
        const title = this._lines[0];

        let text;
        if (this._lines[1] == '') {
            text = this._lines.slice(2).join('\n');
        } else {
            text = this._lines.slice(1).join('\n');
        }

        return {
            title,
            text,
            raw: this._rawSMS,
            type: recordTypes.exercise,
        };
    }
}
