const whatsappService = require('../services/whatsapp.service');
const content = require('../services/messages'); // Adjust path to messages.js if needed
const axios = require('axios'); // Use axios for sending data to Google Sheets

// 👉 YOUR GOOGLE SCRIPT WEB APP URL:
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxVxB6YYEpWtk7axLhqFnPvWBVzNaaUK74q2gxC3mt9STHDjt1XMugJ40qgaPFSyJRbDg/exec';

// Helper function to send data to Google Sheet safely
async function sendToGoogleSheet(customerName, senderNumber, chosenService, actionType) {
    try {
        console.log(`[SHEETS] Sending lead data for: ${customerName}...`);

        await axios.post(GOOGLE_SHEET_URL, {
            name: customerName,
            phone: senderNumber,
            service: chosenService,
            action: actionType
        });

        console.log(`✅ [SHEETS SUCCESS] Lead added to Google Sheet!`);
    } catch (error) {
        console.error('❌ [SHEETS ERROR]:', error.message);
    }
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

                    // B. Send Lead Data to Google Sheet
                    const chosenService = content.teamNames[serviceKey] || 'Consulting';
                    await sendToGoogleSheet(customerName, senderNumber, chosenService, 'Viewed Service Details');
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

                        // Send HOT LEAD to Google Sheet
                        const chosenService = content.teamNames[serviceKey] || 'Consulting';
                        await whatsappService.sendAdminAlert(customerName, senderNumber, chosenService);
                        await sendToGoogleSheet(customerName, senderNumber, chosenService, 'Clicked Get Best Price (HOT LEAD)');
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