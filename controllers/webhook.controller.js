const whatsappService = require('../services/whatsapp.service');
const content = require('../services/messages');
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

        // Safety check to prevent crashes if name is hidden
        const customerName = change?.value?.contacts?.[0]?.profile?.name || "Client";

        if (message) {
            const senderNumber = message.from;

            // 1. If any initial text is sent -> Prompt Language Selection
            if (message.type === 'text') {
                await whatsappService.sendLanguageSelection(senderNumber, customerName);
            }

            // 2. If an interactive element is clicked
            if (message.type === 'interactive') {
                const interactive = message.interactive;

                // Handle List Options (Service selection from Main Menu)
                if (interactive.type === 'list_reply') {
                    const fullId = interactive.list_reply.id; // e.g. "srv_web_en"
                    const parts = fullId.split('_');
                    const serviceKey = `${parts[0]}_${parts[1]}`; // "srv_web"
                    const lang = parts[2] || 'en'; // "en" or "hi"

                    await whatsappService.sendServiceDetails(senderNumber, serviceKey, lang);
                }

                // Handle Button Clicks
                if (interactive.type === 'button_reply') {
                    const buttonId = interactive.button_reply.id;

                    // Language Selection: "lang_en"
                    if (buttonId.startsWith('lang_')) {
                        const selectedLang = buttonId.replace('lang_', '');
                        await whatsappService.sendMainMenu(senderNumber, selectedLang);
                    }

                    // Main Menu Return Button: "menu_en"
                    else if (buttonId.startsWith('menu_')) {
                        const lang = buttonId.replace('menu_', '');
                        await whatsappService.sendMainMenu(senderNumber, lang);
                    }

                    // 🎯 GET BEST PRICE BUTTON CLICKED: "price_srv_web_en"
                    else if (buttonId.startsWith('price_')) {
                        // Extract details: price_srv_web_en -> ['price', 'srv', 'web', 'en']
                        const parts = buttonId.split('_');
                        const serviceKey = `${parts[1]}_${parts[2]}`; // "srv_web"
                        const lang = parts[3] || 'en';

                        // 1. Send the Final Thank You Message on WhatsApp
                        await whatsappService.sendFinalMessage(senderNumber, serviceKey, lang);

                        // 2. Send the Email Alert to You
                        const teamName = content.teamNames[serviceKey] || 'Consulting';
                        const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: 'deen8851@gmail.com',
                            subject: `🎯 New Lead Alert: ${customerName} wants ${teamName}`,
                            text: `You have a new hot lead from WhatsApp!\n\nClient Name: ${customerName}\nWhatsApp Number: ${senderNumber}\nInterested Service: ${teamName}\n\nAction: The user clicked 'Get Best Price'. Please contact them immediately.`
                        };

                        try {
                            await transporter.sendMail(mailOptions);
                            console.log('Lead Email sent successfully to admin!');
                        } catch (error) {
                            console.error('Error sending email:', error);
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