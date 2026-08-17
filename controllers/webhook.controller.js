const whatsappService = require('../services/whatsapp.service');

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

            // 1. If any initial text is sent -> Prompt Language Selection
            if (message.type === 'text') {
                await whatsappService.sendLanguageSelection(senderNumber, customerName);
            }

            // 2. If an interactive element is clicked
            if (message.type === 'interactive') {
                const interactive = message.interactive;

                // Handle List Options (Service selection)
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

                    // Language Selection Buttons: "lang_en" or "lang_hi"
                    if (buttonId.startsWith('lang_')) {
                        const selectedLang = buttonId.replace('lang_', '');
                        await whatsappService.sendMainMenu(senderNumber, selectedLang);
                    }

                    // Main Menu Return Button: "menu_en" or "menu_hi"
                    else if (buttonId.startsWith('menu_')) {
                        const lang = buttonId.replace('menu_', '');
                        await whatsappService.sendMainMenu(senderNumber, lang);
                    }

                    // Consultation / Callback Request: "quote_srv_web_en"
                    else if (buttonId.startsWith('quote_')) {
                        const parts = buttonId.split('_');
                        const lang = parts[parts.length - 1]; // last token is lang
                        await whatsappService.sendConsultationConfirmation(senderNumber, lang);
                    }

                    // Payment / Token Booking Button: "pay_srv_web_en"
                    else if (buttonId.startsWith('pay_')) {
                        const parts = buttonId.split('_');
                        const serviceKey = `${parts[1]}_${parts[2]}`; // "srv_web"
                        const lang = parts[3] || 'en';
                        await whatsappService.sendPaymentAndReceipt(senderNumber, serviceKey, lang);
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