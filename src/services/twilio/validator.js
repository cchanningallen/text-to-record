import db from '../db';

export default class TwilioValidator {
    constructor(request) {
        this._request = request;
    }

    // If return value is present, request is invalid.
    async validate() {
        const senderPhone = this._request.body.From;
        const sender = await db.users.getByPhone(senderPhone);

        console.log({ senderPhone, sender });

        if (!sender || !sender.emailVerified) {
            return { message: 'Sender not approved' };
        }
    }
}
