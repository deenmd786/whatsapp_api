require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer'); // Import nodemailer
const cors = require('cors');

// Import routes
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// This is the endpoint UptimeRobot will hit
app.get('/ping', (req, res) => {
    console.log('Ping received! Keeping server awake.');
    res.status(200).send('Awake');
});

// Root health check
app.get('/', (req, res) => res.send('Digroz Webhook Server Live!'));

// Use Routes
app.use('/webhook', webhookRoutes);

// -------------------------------------------------------------
// SETUP EMAIL TRANSPORTER
// -------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_USER}`, // 👈 Put your Digroz Gmail here
        pass: `${process.env.EMAIL_PASS}` // 👈 Put the App Password here (no spaces)
    }
});

// -------------------------------------------------------------
// YOUR WEBHOOK
// -------------------------------------------------------------
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry[0];
        const changes = entry.changes[0].value;

        if (changes.messages && changes.messages.length > 0) {
            const message = changes.messages[0];
            const phone = message.from;
            const contactName = changes.contacts[0].profile.name;

            // IF THE USER TYPED A MESSAGE (Filled out the form)
            if (message.type === 'text') {
                const userText = message.text.body;

                console.log(`New Lead: ${contactName} (${phone}) - ${userText}`);

                // Send Email to Yourself
                const mailOptions = {
                    from: `${process.env.EMAIL_USER}`,     // Sent from your bot email
                    to: 'deen8851@gmail.com',       // Sent TO your personal/business email (can be the same)
                    subject: `🚀 New Lead Alert: ${contactName}`,
                    text: `You have a new form submission from WhatsApp!\n\nClient Name: ${contactName}\nWhatsApp Number: ${phone}\n\nClient Details:\n${userText}`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email sent successfully!');
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }

            // IF THE USER CLICKED A BUTTON
            if (message.type === 'interactive') {
                const buttonId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;
                console.log(`User clicked button: ${buttonId}`);

                // Trigger your bot.js functions here based on buttonId
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));