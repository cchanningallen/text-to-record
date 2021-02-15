import fetch from '../../util/fetch';

async function twilioSMS(req, res) {
    const body = JSON.stringify({
        title: req.body,
        text: req.body,
        raw: req.body,
    });

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
