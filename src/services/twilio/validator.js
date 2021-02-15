function validate(req) {
    // TODO: Consider pushing down the callchain by validating
    // against authed users' numbers from DB.
    if (!process.env.APPROVED_TWILIO_FROM_NUMBERS.includes(req.body.From)) {
        throw new Error('Sender not approved');
    }
}

export { validate };
