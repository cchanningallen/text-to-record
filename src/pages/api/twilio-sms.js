import fetch from '../../util/fetch';

async function twilioSMS(req, res) {
    const sms = req.body.Body;

    const body = JSON.stringify({
        title: sms,
        text: sms,
        raw: sms,
        type: 'TEST',
    });
    console.log({ sms, body, reqBody: req.body });

    const data = await fetch('/api/create-record', {
        method: 'POST',
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

exports.twilioSMS = twilioSMS;
export default twilioSMS;
