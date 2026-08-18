const axios = require('axios');
const content = require('./messages');

// Helper to interact with WhatsApp Cloud API
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
// STEP 1: Send Language Selection
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
// STEP 2: Send Services & Pricing List Menu
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
// STEP 3: Send Deliverables, Pricing & Action Buttons
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
            body: { text: `${detailsText}${data.actionPrompt}` },
            action: {
                buttons: [
                    { type: "reply", reply: { id: `pay_${serviceKey}_${lang}`, title: data.btnPay } },
                    { type: "reply", reply: { id: `form_${serviceKey}_${lang}`, title: data.btnForm } },
                    { type: "reply", reply: { id: `menu_${lang}`, title: data.btnBack } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 4A: Send Dedicated Form / Questionnaire
// -------------------------------------------------------------
async function sendLeadForm(toPhone, serviceKey, lang = 'en') {
    let formText = "";

    if (serviceKey === 'srv_web' || serviceKey === 'srv_app') {
        formText = content.forms[lang].web_app;
    } else if (serviceKey === 'srv_meta') {
        formText = content.forms[lang].meta_ads;
    } else if (serviceKey === 'srv_google') {
        formText = content.forms[lang].google_ads;
    } else if (serviceKey === 'srv_auto') {
        formText = content.forms[lang].auto;
    }

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: { body: formText }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 4B: Send Token Payment Link & Team Assignment
// -------------------------------------------------------------
async function sendPayment(toPhone, serviceKey, lang = 'en') {
    const link = content.paymentUrls[serviceKey] || content.paymentUrls['srv_web'];

    // Map service to specialist team
    const teamMap = {
        'srv_web': 'Website Development',
        'srv_app': 'App & Software',
        'srv_meta': 'Meta Ads',
        'srv_google': 'Google & YouTube Ads',
        'srv_auto': 'Automation & Bot'
    };
    const team = teamMap[serviceKey] || 'Consulting';

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: { body: content.paymentMessage[lang](link, team), preview_url: true }
    };
    await sendToWhatsApp(payload);
}

module.exports = {
    sendLanguageSelection,
    sendMainMenu,
    sendServiceDetails,
    sendLeadForm,
    sendPayment
};