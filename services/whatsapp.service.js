const axios = require('axios');

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
            header: { type: "text", text: "Welcome to Digroz Agency 🚀" },
            body: {
                text: `Hello ${name}! We help businesses scale with modern tech, automation, and targeted ads.\n\nPlease choose your preferred language:\nकृपया अपनी पसंदीदा भाषा चुनें:`
            },
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
    const isHindi = lang === 'hi';

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: isHindi ? "डिग्रोज़ एजेंसी सर्विसेज" : "Digroz Agency Solutions"
            },
            body: {
                text: isHindi
                    ? "हम आपके बिजनेस को डिजिटल रूप से ग्रो करने में मदद करते हैं। कृपया नीचे दी गई लिस्ट में से अपनी जरूरत की सर्विस चुनें:"
                    : "Select a service below to explore our deliverables and custom solutions:"
            },
            footer: {
                text: isHindi ? "सर्विस देखने के लिए नीचे टैप करें" : "Tap below to view services"
            },
            action: {
                button: isHindi ? "सर्विस चुनें" : "View Services",
                sections: [{
                    title: isHindi ? "हमारी सर्विसेज" : "Our Core Services",
                    rows: [
                        { id: `srv_web_${lang}`, title: "🌐 Website Development", description: isHindi ? "हाई-स्पीड, मॉडर्न बिज़नेस वेबसाइट्स" : "High-converting, responsive websites" },
                        { id: `srv_app_${lang}`, title: "📱 App & Web Development", description: isHindi ? "कस्टम मोबाइल ऐप्स और वेब पोर्टल्स" : "Custom iOS/Android apps & web suites" },
                        { id: `srv_auto_${lang}`, title: "⚡ Business Automation", description: isHindi ? "व्हाट्सएप बॉट, CRM और लीड ऑटोमेशन" : "WhatsApp bots, CRMs & workflow automation" },
                        { id: `srv_meta_${lang}`, title: "🎯 Meta Ads (FB & Insta)", description: isHindi ? "टारगेटेड लीड्स और सेल्स ग्रोथ" : "Laser-targeted leads & brand awareness" },
                        { id: `srv_google_${lang}`, title: "📈 Google & YouTube Ads", description: isHindi ? "हाई-इंटेंट सर्च और वीडियो कैम्पेन्स" : "High-intent buyer traffic & search ads" }
                    ]
                }]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 3: Point-by-Point Service Deliverables (No rigid prices)
// -------------------------------------------------------------
async function sendServiceDetails(toPhone, serviceKey, lang = 'en') {
    const isHindi = lang === 'hi';
    let detailsText = "";

    if (serviceKey === 'srv_web') {
        detailsText = isHindi
            ? "*🌐 Website Development*\n\nहम सिर्फ वेबसाइट नहीं, बल्कि आपके बिजनेस के लिए एक 24/7 सेल्स मशीन बनाते हैं:\n\n• *मॉडर्न UI/UX डिजाइन:* मोबाइल और डेस्कटॉप दोनों के लिए फुली रिस्पॉन्सिव\n• *अल्ट्रा-फास्ट लोडिंग स्पीड:* नेक्स्ट-जेन टेक स्टैक पर तैयार\n• *SEO-फ्रेंडली स्ट्रक्चर:* गूगल सर्च में रैंक करने के लिए ऑप्टिमाइज़्ड\n• *लीड कैप्चर और व्हाट्सएप इंटीग्रेशन:* डायरेक्ट कस्टमर कनेक्ट"
            : "*🌐 Website Development*\n\nWe build high-performance websites engineered to turn visitors into paying customers:\n\n• *Custom Modern UI/UX:* 100% mobile-responsive & tailored to your brand\n• *Blazing-Fast Speed:* Built with modern high-performance frameworks\n• *Search Engine Ready:* On-page SEO structure baked in\n• *Direct Integrations:* WhatsApp chat, lead capture forms & CRM ready";
    } else if (serviceKey === 'srv_app') {
        detailsText = isHindi
            ? "*📱 App + Web Development*\n\nआपके पूरे बिजनेस ऑपरेशन्स के लिए एंड-टू-एंड टेक सॉल्यूशन:\n\n• *कस्टम iOS & Android ऐप्स:* स्मूद परफॉरमेंस और क्लीन इंटरफ़ेस\n• *सेंट्रलाइज्ड एडमिन डैशबोर्ड:* रियल-टाइम डेटा, यूजर और ऑर्डर मैनेजमेंट\n• *सिक्योर पेमेंट गेटवे:* UPI, कार्ड्स और ऑटोमेटेड इनवॉइसिंग\n• *क्लाउड आर्किटेक्चर:* 99.9% अपटाइम और स्केलेबल बैकएंड"
            : "*📱 App + Web Development*\n\nEnd-to-end digital infrastructure for scalable business operations:\n\n• *Native/Cross-Platform Apps:* Modern UI/UX for iOS & Android\n• *Unified Admin Panel:* Manage users, orders, and data seamlessly\n• *Payment Gateway Integration:* Direct UPI, cards, and automated billing\n• *Scalable Cloud Architecture:* Reliable, fast, and secure database setups";
    } else if (serviceKey === 'srv_auto') {
        detailsText = isHindi
            ? "*⚡ Business Automation (Web + SEO + SMO)*\n\nबिना मैन्युअल मेहनत के अपने बिजनेस को ऑटोपायलट पर चलाएं:\n\n• *व्हाट्सएप ऑटोमेशन:* कस्टमर चैट्स और लीड्स का 24/7 ऑटो-रिप्लाई\n• *स्मार्ट CRM सेटअप:* लीड्स को ऑटोमैटिकली ट्रैक और नर्चर करें\n• *SEO & सोशल मीडिया ऑप्टिमाइजेशन:* ऑर्गेनिक रीच और ब्रांड विजिबिलिटी\n• *वर्कफ़्लो इंटीग्रेशन:* गूगल शीट्स, इनवॉइसिंग और ईमेल ऑटोमेशन"
            : "*⚡ Business Automation (Web + SEO + SMO)*\n\nPut your repetitive business operations and client acquisition on autopilot:\n\n• *WhatsApp Chatbots:* Instant 24/7 customer handling and lead capture\n• *Smart CRM Integration:* Auto-sync inquiries directly to your team\n• *Full SEO & SMO Growth:* Complete search and social presence build\n• *Custom Workflows:* Zero-manual-effort tracking and notifications";
    } else if (serviceKey === 'srv_meta') {
        detailsText = isHindi
            ? "*🎯 Meta Ads (Facebook & Instagram)*\n\nक्वालिटी कस्टमर्स तक सीधे पहुंचें और अपना ROI बढ़ाएं:\n\n• *प्रेसिजन ऑडियंस टारगेटिंग:* सिर्फ उन्हीं लोगों को ऐड दिखेगा जो आपके ग्राहक हैं\n• *हाई-कन्वर्टिंग ऐड क्रिएटिव्स:* स्क्रॉल-स्टॉपिंग पोस्ट्स और वीडियो ऐड्स\n• *लीड जेनरेशन फ़नल:* सीधे व्हाट्सएप या CRM में वेरिफाइड लीड्स\n• *A/B टेस्टिंग & वीकली रिपोर्टिंग:* बजट का अधिकतम रिटर्न"
            : "*🎯 Meta Ads (Facebook & Instagram)*\n\nAcquire qualified leads and drive predictable sales:\n\n• *Laser-Targeted Audiences:* Target users ready to buy\n• *High-Converting Ad Creatives:* Scroll-stopping graphics and copy\n• *Direct Lead Funnels:* Capture verified leads straight into WhatsApp\n• *Continuous Optimization:* Daily tracking and A/B split-testing";
    } else if (serviceKey === 'srv_google') {
        detailsText = isHindi
            ? "*📈 Google & YouTube Ads*\n\nउन ग्राहकों को टारगेट करें जो इस वक्त आपकी सर्विस गूगल पर ढूंढ रहे हैं:\n\n• *हाई-इंटेंट सर्च कैम्पेन्स:* आपके कीवर्ड्स पर टॉप रैंकिंग\n• *YouTube वीडियो ऐड्स:* ब्रांड ट्रस्ट और विजुअल रीच\n• *कस्टम लैंडिंग पेज गाइडेंस:* ऐड क्लिक्स को डायरेक्ट कॉल्स में बदलें\n• *नेगेटिव कीवर्ड मैनेजमेंट:* आपका बजट कभी बेकार क्लिक्स पर खर्च नहीं होगा"
            : "*📈 Google & YouTube Ads*\n\nCapture high-intent prospects actively searching for your services:\n\n• *Search Intent Campaigns:* Appear at the exact moment clients search\n• *YouTube Video Ads:* Build high brand trust and mass local reach\n• *Conversion Rate Optimization:* Convert search clicks into phone calls\n• *Budget Protection:* Rigorous negative keyword filtering to eliminate wasted spend";
    }

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "button",
            body: {
                text: detailsText + (isHindi ? "\n\nआगे बढ़ने के लिए विकल्प चुनें:" : "\n\nChoose an option below to proceed:")
            },
            action: {
                buttons: [
                    { type: "reply", reply: { id: `quote_${serviceKey}_${lang}`, title: isHindi ? "📞 फ्री कॉल बुक करें" : "📞 Book Strategy Call" } },
                    { type: "reply", reply: { id: `pay_${serviceKey}_${lang}`, title: isHindi ? "💳 टोकन / एडवांस दें" : "💳 Pay Token / Book" } },
                    { type: "reply", reply: { id: `menu_${lang}`, title: isHindi ? "🔙 वापस जाएं" : "🔙 Main Menu" } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// -------------------------------------------------------------
// STEP 4A: Send Razorpay Payment Link (For Token / Advance)
// -------------------------------------------------------------
async function sendPaymentAndReceipt(toPhone, serviceKey, lang = 'en') {
    const isHindi = lang === 'hi';

    const paymentLinks = {
        'srv_web': 'https://rzp.io/l/H6dBjYGP',
        'srv_app': 'https://rzp.io/l/amO3XoLb',
        'srv_auto': 'https://rzp.io/l/D2ckFS9g',
        'srv_meta': 'https://rzp.io/l/gmh0viTf',
        'srv_google': 'https://rzp.io/l/jwTVi03v'
    };

    const linkToSend = paymentLinks[serviceKey] || 'https://rzp.io/l/H6dBjYGP';

    const paymentText = isHindi
        ? `शानदार! 🚀\n\nअपने प्रोजेक्ट को तुरंत लॉक इन करने और ऑनबोर्डिंग स्लॉट बुक करने के लिए, नीचे दिए गए सुरक्षित रेजरपे लिंक से टोकन राशि जमा करें:\n\n🔗 *Payment Link:* ${linkToSend}\n\n_पेमेंट के बाद स्क्रीनशॉट भेजें। हमारी टीम 30 मिनट के भीतर आपसे संपर्क करेगी।_`
        : `Awesome! 🚀\n\nTo lock in your onboarding slot and kick off your project immediately, please complete the token deposit via our secure Razorpay link below:\n\n🔗 *Payment Link:* ${linkToSend}\n\n_Once completed, simply reply here with the confirmation. Our lead consultant will connect with you within 30 minutes!_`;

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
    const isHindi = lang === 'hi';

    const message = isHindi
        ? "धन्यवाद! 🙏\n\nआपकी रिक्वेस्ट हमें मिल गई है। हमारे सीनियर डिजिटल स्ट्रेटेजिस्ट जल्द ही आपके इस नंबर पर संपर्क करेंगे ताकि आपकी आवश्यकताओं के अनुसार एक कस्टम प्रपोजल और कोटेशन तैयार किया जा सके।"
        : "Thank you! 🙏\n\nYour request has been received. Our senior strategist will review your requirements and reach out to you directly on this WhatsApp number to discuss custom scope and timelines.";

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