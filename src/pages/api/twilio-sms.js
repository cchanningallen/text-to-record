import requests from '../../util/requests';
import {
    TwilioSMSDecoder,
    TwilioSMSParser,
    TwilioValidator,
    TwilioMessagingResponse,
} from '../../services/twilio';
import db from '../../services/db';
import { roles } from '../../constants';

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

    let response = {};
    if (sender.role == roles.admin) {
        // Only opt admins into new Decoder logic
        const decoder = new TwilioSMSDecoder(sms, sender);
        await decoder.run();
        response = decoder.response();
    } else {
        // If not admin, just run old parsing logic
        response = new TwilioSMSParser(sms).parse();
    }

    const data = await db.records.create({
        ...response,
        userID: sender.id,
    });
    console.log('Created record', { data });

    const twilioResponse = new TwilioMessagingResponse();
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twilioResponse.toString());
}

exports.twilioSMS = twilioSMS;
export default twilioSMS;
