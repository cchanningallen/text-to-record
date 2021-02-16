export default class TwilioValidator {
    constructor(request) {
        this._request = request;
    }

    // If return value is present, request is invalid.
    validate() {
        // TODO: Consider pushing down the callchain by validating
        // against authed users' numbers from DB.
        const senderApproved = process.env.APPROVED_TWILIO_FROM_NUMBERS.includes(
            this._request.body.From
        );
        if (!senderApproved) {
            return { message: 'Sender not approved' };
        }
    }
}
