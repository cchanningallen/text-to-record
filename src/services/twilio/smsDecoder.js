import { recordTypes } from '../../constants';
import { NotionSMSHandler } from '../notion';

const TYPE_MATCHERS = {
    n: recordTypes.notion,
    notion: recordTypes.notion,
};

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
export default class TwilioSMSDecoder {
    constructor(sms, sender) {
        this._rawSMS = sms;
        this._sender = sender;
        this._response = {};
    }

    async run() {
        this._ingest();
        await this._execute();
    }

    response() {
        return this._response;
    }

    _ingest() {
        this._lines = this._rawSMS.split('\n').map((l) => l.trim());
    }

    async _execute() {
        if (this._lines.length == 1) {
            return this._handleSingleLineSMS();
        }
        await this._handleMultiLineSMS();
    }

    _handleSingleLineSMS() {
        const line = this._lines[0];

        const meditationMatch = line.match(MATCHERS.meditation);
        if (meditationMatch) {
            const duration = meditationMatch[1];

            this._response = {
                title: `Meditated for ${duration} minutes`,
                text: '',
                raw: this._rawSMS,
                type: recordTypes.meditation,
            };
            return;
        }

        if (line.length > TEST_LINE_LENGTH_MAX) {
            this._response = {
                title: 'Thought',
                text: line,
                raw: this._rawSMS,
                type: recordTypes.thought,
            };
            return;
        }

        this._response = {
            title: line,
            text: line,
            raw: this._rawSMS,
            type: recordTypes.test,
        };
    }

    async _handleMultiLineSMS() {
        const title = this._lines[0];
        const parsedSMS =
            this._lines[1] == ''
                ? [...this._lines].slice(2)
                : [...this._lines].slice(1);

        const smsType = TYPE_MATCHERS[title.toLowerCase()];
        switch (smsType) {
            case recordTypes.notion: {
                const notionSMSHandler = new NotionSMSHandler(
                    parsedSMS,
                    this._sender
                );
                const text = await notionSMSHandler.run();
                this._response = {
                    title: 'Notion',
                    text,
                    raw: this._rawSMS,
                    type: recordTypes.notion,
                };
                return;
            }
            default: {
                // Default: categorize as exercise for back-compat
                this._response = {
                    title,
                    text: parsedSMS.join('\n'),
                    raw: this._rawSMS,
                    type: recordTypes.exercise,
                };
            }
        }
    }
}
