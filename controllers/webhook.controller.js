const whatsappService = require('../services/whatsapp.service');
const content = require('../services/messages'); // Adjust path to messages.js if needed
const nodemailer = require('nodemailer');

// -------------------------------------------------------------
// SETUP EMAIL TRANSPORTER (With Timeout Protection)
// -------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true,
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 5000,
    socketTimeout: 10000
});

// Helper function to send lead emails safely
function sendLeadEmail(customerName, senderNumber, chosenService, actionType) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'deen8851@gmail.com',
        subject: `🎯 New Lead Alert: ${customerName} interested in ${chosenService}`,
        text: `New Lead Alert!\n\nName: ${customerName}\nWhatsApp Number: ${senderNumber}\nInterested Service: ${chosenService}\nAction: ${actionType}\n\nYou can reach out to them directly on WhatsApp!`
    };

    console.log(`[EMAIL] Attempting to send email for: ${chosenService}...`);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ [EMAIL ERROR]:', error.message);
        } else {
            console.log(`✅ [EMAIL SUCCESS] Sent to deen8851@gmail.com (ID: ${info.messageId})`);
        }
    });
}

// 1. Webhook Verification (GET)
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
};

// 2. Main Webhook Handler (POST)
const handleWebhook = async (req, res) => {
    res.sendStatus(200); // Acknowledge Meta immediately

    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const message = change?.value?.messages?.[0];

        const customerName = change?.value?.contacts?.[0]?.profile?.name || "Client";

        if (message) {
            const senderNumber = message.from;

            // User sends initial text (e.g., "Hi")
            if (message.type === 'text') {
                await whatsappService.sendLanguageSelection(senderNumber, customerName);
            }

            // User interacts with buttons/lists
            if (message.type === 'interactive') {
                const interactive = message.interactive;

                // 🎯 1. TRIGGERED WHEN USER CHOOSES A SERVICE FROM THE LIST MENU
                if (interactive.type === 'list_reply') {
                    const fullId = interactive.list_reply.id; // e.g. "srv_web_en"
                    const parts = fullId.split('_');
                    const serviceKey = `${parts[0]}_${parts[1]}`; // "srv_web"
                    const lang = parts[2] || 'en';

                    // A. Send Service Details to the user on WhatsApp
                    await whatsappService.sendServiceDetails(senderNumber, serviceKey, lang);

                    // B. Send Email Alert to you immediately
                    const chosenService = content.teamNames[serviceKey] || 'Consulting';
                    sendLeadEmail(customerName, senderNumber, chosenService, 'Selected from Service Menu');
                }

                // 🎯 2. TRIGGERED WHEN USER CLICKS BUTTONS
                if (interactive.type === 'button_reply') {
                    const buttonId = interactive.button_reply.id;

                    // Language Selection
                    if (buttonId.startsWith('lang_')) {
                        const selectedLang = buttonId.replace('lang_', '');
                        await whatsappService.sendMainMenu(senderNumber, selectedLang);
                    }
                    // Back to Main Menu
                    else if (buttonId.startsWith('menu_')) {
                        const lang = buttonId.replace('menu_', '');
                        await whatsappService.sendMainMenu(senderNumber, lang);
                    }
                    // "Get Best Price" Button Clicked
                    else if (buttonId.startsWith('price_')) {
                        const parts = buttonId.split('_');
                        const serviceKey = `${parts[1]}_${parts[2]}`;
                        const lang = parts[3] || 'en';

                        // Send Final Thank You message on WhatsApp
                        await whatsappService.sendFinalMessage(senderNumber, serviceKey, lang);

                        // Send Email Alert
                        const chosenService = content.teamNames[serviceKey] || 'Consulting';
                        sendLeadEmail(customerName, senderNumber, chosenService, 'Clicked Get Best Price');
                    }
                }
            }
        }
    } catch (error) {
        console.error("❌ [CRITICAL ERROR] in webhook handler:", error.message);
    }
};

module.exports = {
    verifyWebhook,
    handleWebhook
};