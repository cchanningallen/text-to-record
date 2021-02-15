import fetch from '../../util/fetch';

async function twilioSMS(req, res) {
    const data = fetch('./create-record', {
        method: 'POST',
        body: JSON.stringify({
            title: req.body,
            text: req.body,
        }),
    }).catch((err) => {
        throw new Error(err);
    });

    res.status(200).json({ data });
}

exports.twilioSMS = twilioSMS;
export default twilioSMS;
