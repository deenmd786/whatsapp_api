require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Import your separated bot logic and messages
const bot = require('./bot');
const content = require('./messages');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// -------------------------------------------------------------
// BASIC SERVER HEALTH ROUTES
// -------------------------------------------------------------
app.get('/ping', (req, res) => {
    console.log('Ping received! Keeping server awake.');
    res.status(200).send('Awake');
});

app.get('/', (req, res) => res.send('Digroz Webhook Server Live!'));

// -------------------------------------------------------------
// SETUP EMAIL TRANSPORTER
// -------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// -------------------------------------------------------------
// META WEBHOOK VERIFICATION (GET)
// -------------------------------------------------------------
app.get('/webhook', (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN; // Add VERIFY_TOKEN to your .env file

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// -------------------------------------------------------------
// MAIN WEBHOOK LISTENER (POST)
// -------------------------------------------------------------
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry[0];
        const changes = entry.changes[0].value;

        if (changes.messages && changes.messages.length > 0) {
            const message = changes.messages[0];
            const phone = message.from;

            // Safety check: Prevent app crash if Meta doesn't send contact info
            const contactName = changes.contacts ? changes.contacts[0].profile.name : "Client";

            // =========================================================
            // 1. IF THE USER TYPES A MESSAGE (e.g., "Hi", "Hello")
            // =========================================================
            if (message.type === 'text') {
                const userText = message.text.body;
                console.log(`Received message from ${contactName} (${phone}): ${userText}`);

                // Send Language Selection as the default starting point
                await bot.sendLanguageSelection(phone, contactName);
            }

            // =========================================================
            // 2. IF THE USER CLICKS A LIST ITEM OR BUTTON
            // =========================================================
            if (message.type === 'interactive') {
                const buttonId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;
                console.log(`User clicked button/list item: ${buttonId}`);

                // A. Language Selected -> Send Main Menu
                if (buttonId.startsWith('lang_')) {
                    const lang = buttonId.split('_')[1]; // Extracts 'en' or 'hi'
                    await bot.sendMainMenu(phone, lang);
                }

                // B. Back to Main Menu Clicked
                else if (buttonId.startsWith('menu_')) {
                    const lang = buttonId.split('_')[1];
                    await bot.sendMainMenu(phone, lang);
                }

                // C. Service Selected from List -> Send Service Details
                else if (buttonId.startsWith('srv_')) {
                    const parts = buttonId.split('_');
                    const lang = parts.pop(); // Removes and gets the last item ('en' or 'hi')
                    const serviceKey = parts.join('_'); // Reconnects the rest (e.g., 'srv_web')

                    await bot.sendServiceDetails(phone, serviceKey, lang);
                }

                // D. "Get Best Price" Button Clicked -> Send Final Message & Trigger Email
                else if (buttonId.startsWith('price_')) {
                    const parts = buttonId.split('_');
                    const lang = parts.pop();
                    const serviceKey = parts.slice(1).join('_'); // Extracts 'srv_web' from 'price_srv_web_en'

                    // 1. Send the Final Thank You message on WhatsApp
                    await bot.sendFinalMessage(phone, serviceKey, lang);

                    // 2. Shoot Email Alert to You
                    const teamName = content.teamNames[serviceKey] || 'Consulting';
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: 'deen8851@gmail.com', // Your notification email
                        subject: `🎯 New Hot Lead: ${contactName} wants ${teamName}`,
                        text: `You have a new lead from your WhatsApp Bot!\n\nClient Name: ${contactName}\nWhatsApp Number: +${phone}\nInterested Service: ${teamName}\n\nAction Required: The user clicked 'Get Best Price'. Please contact them immediately.`
                    };

                    try {
                        await transporter.sendMail(mailOptions);
                        console.log(`Email lead sent successfully for ${contactName}!`);
                    } catch (error) {
                        console.error('Error sending email:', error);
                    }
                }
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Start the server
app.listen(PORT, () => console.log(`Digroz Webhook Server running on port ${PORT}`));