require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// 1. IMPORT YOUR WHATSAPP SERVICE AND MESSAGES CONTENT
const whatsappService = require('./services/whatsapp.service');
const content = require('./services/messages');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
    console.log('Ping received! Keeping server awake.');
    res.status(200).send('Awake');
});

app.get('/', (req, res) => res.send('Digroz Webhook Server Live!'));

// ⚠️ IMPORTANT: I commented this out because you are defining POST /webhook below.
// If you leave this active, Express will ignore the webhook logic at the bottom of this file.
// const webhookRoutes = require('./routes/webhook.routes');
// app.use('/webhook', webhookRoutes);

// META WEBHOOK VERIFICATION (GET)
app.get('/webhook', (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// -------------------------------------------------------------
// SETUP EMAIL TRANSPORTER
// -------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Cleaned up syntax
        pass: process.env.EMAIL_PASS
    }
});

// -------------------------------------------------------------
// YOUR WEBHOOK (POST)
// -------------------------------------------------------------
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry[0];
        const changes = entry.changes[0].value;

        if (changes.messages && changes.messages.length > 0) {
            const message = changes.messages[0];
            const phone = message.from;

            // Safety check: Ensure contact profile exists so the server doesn't crash
            const contactName = changes.contacts ? changes.contacts[0].profile.name : "Client";

            // IF THE USER TYPED A MESSAGE
            if (message.type === 'text') {
                const userText = message.text.body;
                console.log(`New Message: ${contactName} (${phone}) - ${userText}`);
                // You can keep standard text handling here if needed
            }

            // IF THE USER CLICKED A BUTTON OR LIST
            if (message.type === 'interactive') {
                const buttonId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;
                console.log(`User clicked button: ${buttonId}`);

                // 🎯 WHEN THEY CLICK "GET BEST PRICE"
                if (buttonId && buttonId.startsWith('price_')) {

                    // Extract service name and language from the button ID (e.g., price_srv_web_en)
                    const parts = buttonId.split('_');
                    const lang = parts[parts.length - 1]; // 'en' or 'hi'
                    const serviceKey = parts.slice(1, -1).join('_'); // 'srv_web'

                    // 1. Send the Thank You Message on WhatsApp
                    await whatsappService.sendFinalMessage(phone, serviceKey, lang);

                    // 2. Send the Email Alert to You
                    const teamName = content.teamNames[serviceKey] || 'Consulting';
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: 'deen8851@gmail.com',
                        subject: `🎯 New Lead Alert: ${contactName} wants ${teamName}`,
                        text: `You have a new hot lead from WhatsApp!\n\nClient Name: ${contactName}\nWhatsApp Number: ${phone}\nInterested Service: ${teamName}\n\nAction: The user clicked 'Get Best Price'. Please contact them immediately.`
                    };

                    try {
                        await transporter.sendMail(mailOptions);
                        console.log('Lead Email sent successfully!');
                    } catch (error) {
                        console.error('Error sending email:', error);
                    }
                }

                // You will add your other button routing here eventually. Example:
                // else if (buttonId === 'lang_en') {
                //     await whatsappService.sendMainMenu(phone, 'en');
                // }
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));