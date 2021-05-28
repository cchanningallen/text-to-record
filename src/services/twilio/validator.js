import db from '../db';

export default class TwilioValidator {
    constructor(request) {
        this._request = request;
    }

    async validate() {
        const senderPhone = this._request.body.From;
        const sender = await db.users.getByPhone(senderPhone);

        if (!sender || !sender.emailVerified) {
            return { error: 'Sender not approved' };
        }

        return { sender };
    }
}
