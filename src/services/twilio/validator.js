export default class TwilioValidator {
    constructor(request) {
        this._request = request;
    }

    // If return value is present, request is invalid.
    validate() {
        // TODO: Consider pushing down the callchain by validating
        // against authed users' numbers from DB.
        if (!process.env.APPROVED_TWILIO_FROM_NUMBERS.includes(req.body.From)) {
            return { message: 'Sender not approved' };
        }
    }
}
