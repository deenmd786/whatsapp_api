const axios = require('axios');
const content = require('./messages');

async function sendToWhatsApp(payload) {
    const API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
    await axios.post(API_URL, payload, {
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

// 1. Language Selection
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

// 2. Main Menu
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
                    rows: data.services.map(s => ({ id: s.id, title: s.title, description: s.desc }))
                }]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// 3. Service Details with 'Get Best Price' Button
async function sendServiceDetails(toPhone, serviceKey, lang = 'en') {
    const data = content.serviceDetails[lang];
    const detailsText = data[serviceKey] || data['srv_web'];

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "button",
            body: { text: `${detailsText}${data.actionPrompt}` },
            action: {
                buttons: [
                    { type: "reply", reply: { id: `price_${serviceKey}_${lang}`, title: data.btnPrice } },
                    { type: "reply", reply: { id: `menu_${lang}`, title: data.btnBack } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// 4. Send Final Thank You Message
async function sendFinalMessage(toPhone, serviceKey, lang = 'en') {
    const messageText = content.finalMessage[lang](serviceKey);

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: { body: messageText }
    };
    await sendToWhatsApp(payload);
}

module.exports = {
    sendLanguageSelection,
    sendMainMenu,
    sendServiceDetails,
    sendFinalMessage
};