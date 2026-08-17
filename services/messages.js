// Helper to get time-based greeting
function getGreeting(lang = 'en') {
    const hour = new Date().getHours();
    if (lang === 'hi') {
        if (hour < 12) return 'सुप्रभात';
        if (hour < 18) return 'नमस्कार';
        return 'शुभ संध्या';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

const content = {
    // STEP 1: Welcome & Language
    welcome: (name) => {
        const greeting = getGreeting('en');
        return `*Welcome to Digroz Agency* 🚀\n\n${greeting}, ${name}!\n\nYou are here because you want to grow. We help small businesses transform into trusted online brands. Stop chasing customers—let’s build a digital system where they come to *you*.\n\nPlease choose your language:\nकृपया अपनी भाषा चुनें:`;
    },

    // STEP 2: Main Menu
    menu: {
        en: {
            header: "Digroz Agency Solutions",
            body: "What is holding your business back today? Select what you need to grow:",
            footer: "Tap below to explore",
            button: "Grow My Business",
            menuTitle: "Growth Solutions",
            services: [
                { id: "srv_web_en", title: "🌐 Website Creation", desc: "A 24/7 store that builds trust & gets clients" },
                { id: "srv_app_en", title: "📱 App Development", desc: "Put your business in their pockets" },
                { id: "srv_auto_en", title: "⚡ Business Automation", desc: "Save time. Let bots do the hard work" },
                { id: "srv_meta_en", title: "🎯 Meta Ads (FB/IG)", desc: "Reach people ready to buy right now" },
                { id: "srv_google_en", title: "📈 Google/YT Ads", desc: "Be #1 when they search for you" }
            ]
        },
        hi: {
            header: "डिग्रोज़ एजेंसी सॉल्यूशंस",
            body: "आज आपके बिजनेस को आगे बढ़ने से क्या रोक रहा है? अपनी जरूरत चुनें:",
            footer: "सर्विस देखने के लिए नीचे टैप करें",
            button: "बिजनेस बढ़ाएं",
            menuTitle: "हमारी सर्विसेज",
            services: [
                { id: "srv_web_hi", title: "🌐 वेबसाइट डेवलपमेंट", desc: "24/7 चलने वाली आपकी डिजिटल दुकान" },
                { id: "srv_app_hi", title: "📱 ऐप डेवलपमेंट", desc: "अपने बिजनेस को ग्राहकों की मुट्ठी में लाएं" },
                { id: "srv_auto_hi", title: "⚡ बिजनेस ऑटोमेशन", desc: "समय बचाएं, बॉट्स को काम करने दें" },
                { id: "srv_meta_hi", title: "🎯 Meta Ads (FB/IG)", desc: "खरीदारी के लिए तैयार ग्राहकों तक पहुंचें" },
                { id: "srv_google_hi", title: "📈 Google/YT Ads", desc: "जब ग्राहक खोजें, तो सबसे ऊपर दिखें" }
            ]
        }
    },

    // STEP 3: Service Details (Psychology focused: The "Why" over the "What")
    serviceDetails: {
        en: {
            srv_web: "*🌐 Website Development*\n\nWithout a website, your business is invisible. We build fast, premium websites that turn random visitors into loyal customers. Stand out from your competitors today.",
            srv_app: "*📱 App & Web Solutions*\n\nMake it effortless for customers to buy from you. A custom app builds unmatched brand loyalty and keeps them coming back.",
            srv_auto: "*⚡ Business Automation*\n\nStop losing leads because you replied too late. Let our WhatsApp bots and CRM systems handle your clients 24/7 while you sleep.",
            srv_meta: "*🎯 Meta Ads (Facebook/Instagram)*\n\nStop waiting for word-of-mouth. We push your brand directly to the screens of people who actually need your services right now.",
            srv_google: "*📈 Google & YouTube Ads*\n\nCapture clients at the exact moment they search for your service. High-intent traffic means faster sales.",
            actionPrompt: "\n\nReady to take the next step?",
            btnCall: "📞 Book Strategy Call",
            btnPay: "💳 Pay Token / Book",
            btnBack: "🔙 Main Menu"
        },
        hi: {
            srv_web: "*🌐 वेबसाइट डेवलपमेंट*\n\nवेबसाइट के बिना आपका बिजनेस अदृश्य है। हम ऐसी प्रीमियम वेबसाइट बनाते हैं जो देखने वालों को आपके पक्के ग्राहकों में बदल दे।",
            srv_app: "*📱 ऐप और वेब सॉल्यूशंस*\n\nग्राहकों के लिए आपसे जुड़ना आसान बनाएं। एक कस्टम ऐप आपके ब्रांड पर भरोसा बढ़ाता है।",
            srv_auto: "*⚡ बिजनेस ऑटोमेशन*\n\nदेर से रिप्लाई करने के कारण ग्राहक खोना बंद करें। हमारे व्हाट्सएप बॉट को 24/7 आपके ग्राहकों को संभालने दें।",
            srv_meta: "*🎯 Meta Ads (Facebook/Instagram)*\n\nसिर्फ माउथ पब्लिसिटी के भरोसे न रहें। हम आपके ब्रांड को सीधे उन लोगों तक पहुंचाते हैं जिन्हें आपकी जरूरत है।",
            srv_google: "*📈 Google और YouTube Ads*\n\nजब ग्राहक गूगल पर आपकी सर्विस ढूंढें, तो उन्हें सबसे पहले आप दिखें। तेज़ सेल्स के लिए हाई-इंटेंट ट्रैफिक।",
            actionPrompt: "\n\nआगे बढ़ने के लिए विकल्प चुनें:",
            btnCall: "📞 फ्री कॉल बुक करें",
            btnPay: "💳 टोकन / एडवांस दें",
            btnBack: "🔙 वापस जाएं"
        }
    },

    // STEP 4: Payment Links & Responses
    paymentLinks: {
        'srv_web': 'https://rzp.io/l/H6dBjYGP',
        'srv_app': 'https://rzp.io/l/amO3XoLb',
        'srv_auto': 'https://rzp.io/l/D2ckFS9g',
        'srv_meta': 'https://rzp.io/l/gmh0viTf',
        'srv_google': 'https://rzp.io/l/jwTVi03v'
    },

    paymentMessage: {
        en: (link) => `Great decision! 🚀\n\nTo lock in your spot and start immediately, please complete the token deposit via our secure Razorpay link:\n\n🔗 *Pay Here:* ${link}\n\n_Reply with a screenshot once done, and our team will connect within 30 mins._`,
        hi: (link) => `शानदार फैसला! 🚀\n\nप्रोजेक्ट शुरू करने के लिए, कृपया नीचे दिए गए सुरक्षित लिंक से टोकन राशि जमा करें:\n\n🔗 *पेमेंट लिंक:* ${link}\n\n_पेमेंट के बाद स्क्रीनशॉट भेजें। हमारी टीम 30 मिनट में आपसे संपर्क करेगी।_`
    },

    consultationMessage: {
        en: "Thank you! 🙏\n\nWe have received your request. Our growth expert will text you shortly to understand your needs and craft a custom plan for you.",
        hi: "धन्यवाद! 🙏\n\nआपकी रिक्वेस्ट मिल गई है। हमारे एक्सपर्ट जल्द ही आपसे संपर्क करेंगे ताकि आपके बिजनेस के लिए एक सही प्लान तैयार किया जा सके।"
    }
};

module.exports = content;