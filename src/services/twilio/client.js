import twilio from 'twilio';

// Initialize Twilio client lib

const twilioSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioLogLevel = process.env.TWILIO_LOG_LEVEL;
const twilioClient = twilio(twilioSID, twilioAuthToken);
if (twilioLogLevel) {
    twilioClient.logLevel = twilioLogLevel;
}

// Expose Twilio's message response helper (writes valid "twiml")
// Details: https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-node-js

const TwilioMessagingResponse = twilio.twiml.MessagingResponse;

export { twilioClient, TwilioMessagingResponse };
