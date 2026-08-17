const axios = require('axios');
const content = require('./messages'); // Import the separated content file

// Helper Function to trigger the Meta WhatsApp API
async function sendToWhatsApp(payload) {
    const API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
    await axios.post(API_URL, payload, {
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

// -------------------------------------------------------------
// STEP 1: Greet & Select Language
// -------------------------------------------------------------
async function sendLanguageSelection(toPhone, name) {
    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "button",
            body: { text: content.welcome(name) },
            action: {
                buttons: [
                    { type: "reply", reply: { id: "lang_en", title: "🇬🇧 English" } },
                    { type: "reply", reply: { id: "lang_hi", title: "🇮🇳 हिंदी" } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 2: Main Services Menu (Language Aware)
// -------------------------------------------------------------
async function sendMainMenu(toPhone, lang = 'en') {
    const data = content.menu[lang];

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "list",
            header: { type: "text", text: data.header },
            body: { text: data.body },
            footer: { text: data.footer },
            action: {
                button: data.button,
                sections: [{
                    title: data.menuTitle,
                    rows: data.services.map(s => ({
                        id: s.id,
                        title: s.title,
                        description: s.desc
                    }))
                }]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 3: Point-by-Point Service Deliverables
// -------------------------------------------------------------
async function sendServiceDetails(toPhone, serviceKey, lang = 'en') {
    const data = content.serviceDetails[lang];
    const detailsText = data[serviceKey] || data['srv_web'];

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "button",
            body: { text: detailsText + data.actionPrompt },
            action: {
                buttons: [
                    { type: "reply", reply: { id: `quote_${serviceKey}_${lang}`, title: data.btnCall } },
                    { type: "reply", reply: { id: `pay_${serviceKey}_${lang}`, title: data.btnPay } },
                    { type: "reply", reply: { id: `menu_${lang}`, title: data.btnBack } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 4A: Send Razorpay Payment Link
// -------------------------------------------------------------
async function sendPaymentAndReceipt(toPhone, serviceKey, lang = 'en') {
    const linkToSend = content.paymentLinks[serviceKey] || content.paymentLinks['srv_web'];
    const paymentText = content.paymentMessage[lang](linkToSend);

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: { body: paymentText, preview_url: true }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 4B: Free Consultation / Callback Request
// -------------------------------------------------------------
async function sendConsultationConfirmation(toPhone, lang = 'en') {
    const message = content.consultationMessage[lang];

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: { body: message }
    };
    await sendToWhatsApp(payload);
}

module.exports = {
    sendLanguageSelection,
    sendMainMenu,
    sendServiceDetails,
    sendPaymentAndReceipt,
    sendConsultationConfirmation
};