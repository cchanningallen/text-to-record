import request from '../../util/request';
import { TwilioSMSParser, TwilioValidator } from '../../services/twilio';

async function twilioSMS(req, res) {
    TwilioValidator.validate(req);

    const sms = req.body.Body;
    const parsedSMS = new TwilioSMSParser(sms).parse();
    const body = JSON.stringify(parsedSMS);
    console.log({ sms, parsedSMS, body, reqBody: req.body });

    const data = await request
        .post('/api/create-record', {
            body,
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            throw new Error(error);
        });

    res.status(200).json({ data, body });
}

exports.twilioSMS = twilioSMS;
export default twilioSMS;
