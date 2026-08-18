const axios = require('axios');
const content = require('./messages');

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
// STEP 1: Short Greet & Select Language
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
// STEP 2: Main Services Menu (Includes 'About Us' Bullet Points)
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
// STEP 3: Service Details (Bullet points on HOW it helps)
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
                    { type: "reply", reply: { id: `form_${serviceKey}_${lang}`, title: data.btnProceed } },
                    { type: "reply", reply: { id: `menu_${lang}`, title: data.btnBack } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 4: Ask for Details (Name, Business, Budget)
// -------------------------------------------------------------
async function sendLeadForm(toPhone, lang = 'en') {
    const message = content.leadQuestions[lang];

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
    sendLeadForm
};