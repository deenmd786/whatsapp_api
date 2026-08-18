const whatsappService = require('../services/whatsapp.service');
const content = require('../services/messages'); // Make sure this path is correct
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

        const customerName = change?.value?.contacts?.[0]?.profile?.name || "Client";

        if (message) {
            const senderNumber = message.from;

            if (message.type === 'text') {
                await whatsappService.sendLanguageSelection(senderNumber, customerName);
            }

            if (message.type === 'interactive') {
                const interactive = message.interactive;

                // Handle List Options
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

                    console.log(`\n👉 [ACTION] User clicked button ID: ${buttonId}`);

                    if (buttonId.startsWith('lang_')) {
                        const selectedLang = buttonId.replace('lang_', '');
                        await whatsappService.sendMainMenu(senderNumber, selectedLang);
                    }
                    else if (buttonId.startsWith('menu_')) {
                        const lang = buttonId.replace('menu_', '');
                        await whatsappService.sendMainMenu(senderNumber, lang);
                    }

                    // 🎯 "GET BEST PRICE" BUTTON CLICKED
                    else if (buttonId.startsWith('price_')) {
                        console.log(`✅ [DEBUG] "Get Best Price" button logic triggered!`);

                        const parts = buttonId.split('_');
                        const serviceKey = `${parts[1]}_${parts[2]}`;
                        const lang = parts[3] || 'en';

                        console.log(`[DEBUG] Extracted Service: ${serviceKey}`);

                        // 1. Send WhatsApp Message
                        try {
                            await whatsappService.sendFinalMessage(senderNumber, serviceKey, lang);
                            console.log(`[DEBUG] Final WhatsApp message sent successfully.`);
                        } catch (waError) {
                            console.error(`❌ [ERROR] WhatsApp message failed:`, waError.message);
                        }

                        // 2. Send Email
                        const chosenService = content.teamNames[serviceKey] || 'Consulting';
                        const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: 'deen8851@gmail.com',
                            subject: `New Lead: ${customerName} wants ${chosenService}`,
                            text: `New Lead Alert!\n\nName: ${customerName}\nWhatsApp Number: ${senderNumber}\nChosen Service: ${chosenService}`
                        };

                        console.log(`[DEBUG] Preparing to send email from: ${mailOptions.from} to ${mailOptions.to}...`);

                        try {
                            let info = await transporter.sendMail(mailOptions);
                            console.log(`✅ [SUCCESS] Lead Email sent successfully! Message ID: ${info.messageId}`);
                        } catch (error) {
                            console.error('\n❌ [EMAIL ERROR] Failed to send email.');
                            console.error('Error Message:', error.message);
                            console.error('Full Error Details:', error);
                        }
                    } else {
                        console.log(`⚠️ [DEBUG] Button ID ${buttonId} did not match any known actions.`);
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