const whatsappService = require('../services/whatsapp.service');
const content = require('../messages'); // Make sure this path is correct
const nodemailer = require('nodemailer');

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

        // Safety check for customer name
        const customerName = change?.value?.contacts?.[0]?.profile?.name || "Client";

        if (message) {
            const senderNumber = message.from;

            // 1. IF THE USER TYPES TEXT (Like "Hi")
            if (message.type === 'text') {
                await whatsappService.sendLanguageSelection(senderNumber, customerName);
            }

            // 2. IF AN INTERACTIVE ELEMENT IS CLICKED
            if (message.type === 'interactive') {
                const interactive = message.interactive;

                // Handle List Options (Service selection)
                if (interactive.type === 'list_reply') {
                    const fullId = interactive.list_reply.id;
                    const parts = fullId.split('_');
                    const serviceKey = `${parts[0]}_${parts[1]}`;
                    const lang = parts[2] || 'en';

                    await whatsappService.sendServiceDetails(senderNumber, serviceKey, lang);
                }

                // Handle Button Clicks
                if (interactive.type === 'button_reply') {
                    const buttonId = interactive.button_reply.id;

                    // Language Selection Buttons
                    if (buttonId.startsWith('lang_')) {
                        const selectedLang = buttonId.replace('lang_', '');
                        await whatsappService.sendMainMenu(senderNumber, selectedLang);
                    }

                    // Main Menu Return Button
                    else if (buttonId.startsWith('menu_')) {
                        const lang = buttonId.replace('menu_', '');
                        await whatsappService.sendMainMenu(senderNumber, lang);
                    }

                    // 🎯 "GET BEST PRICE" BUTTON CLICKED
                    else if (buttonId.startsWith('price_')) {
                        // Extract service: price_srv_web_en -> 'srv_web'
                        const parts = buttonId.split('_');
                        const serviceKey = `${parts[1]}_${parts[2]}`;
                        const lang = parts[3] || 'en';

                        // 1. Instantly send Final Thank You Message on WhatsApp
                        await whatsappService.sendFinalMessage(senderNumber, serviceKey, lang);

                        // 2. Instantly send Email to Admin
                        const chosenService = content.teamNames[serviceKey] || 'Consulting';
                        const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: 'deen8851@gmail.com', // Your email
                            subject: `New Lead: ${customerName} wants ${chosenService}`,
                            text: `New Lead Alert!\n\nName: ${customerName}\nWhatsApp Number: ${senderNumber}\nChosen Service: ${chosenService}`
                        };

                        try {
                            await transporter.sendMail(mailOptions);
                            console.log(`✅ Lead Email sent successfully for ${customerName}!`);
                        } catch (error) {
                            console.error('❌ Error sending email:', error);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in webhook handler:", error.response?.data || error.message);
    }
};

module.exports = {
    verifyWebhook,
    handleWebhook
};