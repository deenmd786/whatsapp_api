require('dotenv').config();
const nodemailer = require('nodemailer');

// Set up the transporter using your .env variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Set up the test email
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'deen8851@gmail.com', // Your receiving email
    subject: '🚀 Digroz Test Email',
    text: 'If you are reading this, your Nodemailer setup is working perfectly!'
};

console.log('Attempting to send test email... Please wait.');

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('\n❌ ERROR: COULD NOT SEND EMAIL.');
        console.log('Please read the error details below:\n');
        console.error(error.message);
    } else {
        console.log('\n✅ SUCCESS: EMAIL SENT!');
        console.log('Message ID: ' + info.messageId);
        console.log('Check your inbox (and Spam folder) at deen8851@gmail.com');
    }
});