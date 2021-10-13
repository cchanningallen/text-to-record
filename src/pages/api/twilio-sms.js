import requests from '../../util/requests';
import {
    TwilioSMSParser,
    TwilioValidator,
    TwilioMessagingResponse,
} from '../../services/twilio';
import db from '../../services/db';

async function twilioSMS(req, res) {
    // For /test-sms page
    if (typeof req.body == 'string') {
        req.body = JSON.parse(req.body);
    }

    const { error, sender } = await new TwilioValidator(req).validate();
    if (error) {
        return res.status(404).json({ error });
    }

    const sms = req.body.Body;
    const parsedSMS = new TwilioSMSParser(sms).parse();

    const data = await db.records.create({
        ...parsedSMS,
        userID: sender.id,
    });
    console.log('Created record', { data });

    const twilioResponse = new TwilioMessagingResponse();
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twilioResponse.toString());
}

exports.twilioSMS = twilioSMS;
export default twilioSMS;
