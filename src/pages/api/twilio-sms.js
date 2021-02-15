const fetch = require('node-fetch');

async function twilioSMS(req, res) {
    console.log(req.body);

    res.status(200).json({ hello: 'world!' });
}

exports.twilioSMS = twilioSMS;
export default twilioSMS;
