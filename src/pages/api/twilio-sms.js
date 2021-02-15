import request from '../../util/request';

async function twilioSMS(req, res) {
    validate(req);
    const sms = req.body.Body;
    const parsedSMS = parseSMS(sms);
    const body = JSON.stringify(parsedSMS);
    console.log({ sms, body, reqBody: req.body });

    const data = await request
        .post('/api/create-record', {
            body,
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            throw new Error(error);
        });

    console.log(data);

    res.status(200).json({ data, reqBody: req.body, body });
}

function validate(req) {
    // TODO: Consider pushing down the callchain by validating
    // against authed users' numbers from DB.
    if (!process.env.APPROVED_TWILIO_FROM_NUMBERS.includes(req.body.From)) {
        throw new Error('Sender not approved');
    }
}

function parseSMS(sms) {
    const lines = sms.split('\n');
    const [title, ...text] = lines;
    console.log('parseSMS', { lines });

    return {
        title,
        text,
        raw,
        type: 'TEST', // for now
    };
}

exports.twilioSMS = twilioSMS;
export default twilioSMS;
