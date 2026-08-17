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

        // Extract the user's WhatsApp Name automatically!
        const customerName = change?.value?.contacts?.[0]?.profile?.name || "Customer";

        if (message) {
            const senderNumber = message.from;

            // STEP 1: Text message received
            if (message.type === 'text') {
                await whatsappService.sendMainMenu(senderNumber, customerName);
            }

            // STEP 2 & 3: Interactive message (list or button) received
            if (message.type === 'interactive') {
                const interactiveType = message.interactive.type;

                // Handle Service Selection (List Reply)
                if (interactiveType === 'list_reply') {
                    const serviceId = message.interactive.list_reply.id;
                    await whatsappService.sendServiceDetails(senderNumber, serviceId);
                }

                // Handle Payment Button (Button Reply)
                if (interactiveType === 'button_reply') {
                    const buttonId = message.interactive.button_reply.id;
                    if (buttonId.startsWith('pay_')) {
                        await whatsappService.sendPaymentAndReceipt(senderNumber);
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