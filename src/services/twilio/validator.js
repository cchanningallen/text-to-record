import db from '../db';

export default class TwilioValidator {
    constructor(request) {
        this._request = request;
    }

    // If return value is present, request is invalid.
    async validate() {
        console.log('[TwilioValidator] .validate()');
        const senderPhone = this._request.body.From;
        console.log({ senderPhone });
        console.log('[TwilioValidator] db.users.getByPhone(senderPhone)');
        const sender = await db.users.getByPhone(senderPhone);

        console.log({ senderPhone, sender });

        if (!sender || !sender.emailVerified) {
            return { message: 'Sender not approved' };
        }
    }
}
