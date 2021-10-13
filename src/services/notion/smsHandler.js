import { roles } from '../../constants';
import env from '../env';
import metisClient from './metisClient';

class SMSHandler {
    constructor(parsedSMS, sender) {
        this._parsedSMS = parsedSMS;
        this._sender = sender;
        this._text = '';
    }

    async run() {
        // For testing, block side effects
        if (env.isTest()) return this._parsedSMS.join('\n');

        const content = await metisClient.addLogTodo(
            this._parsedSMS,
            this._sender
        );

        return content;
    }

    async _addMetisLogItem() {}
}

export default SMSHandler;
