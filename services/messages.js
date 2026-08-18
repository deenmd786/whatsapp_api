// Helper for time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { en: 'Good Morning', hi: 'सुप्रभात' };
    if (hour < 18) return { en: 'Good Afternoon', hi: 'नमस्कार' };
    return { en: 'Good Evening', hi: 'शुभ संध्या' };
};

const content = {
    // 1. GREETING (Ultra-short)
    welcome: (name) => {
        const time = getGreeting();
        return `*Welcome to Digroz Agency* 🚀\n\n${time.en}, ${name}! 👋\n${time.hi}, ${name}! 👋\n\nChoose language / भाषा चुनें:`;
    },

    // 2. MAIN MENU (Benefits focused, less text)
    menu: {
        en: {
            header: "Digroz Solutions 🚀",
            body: "We help small businesses become brands.\n\n📈 *More Sales*\n⏳ *Save Time*\n⭐ *Build Trust*\n\nSelect a service:",
            footer: "Tap below to start",
            button: "Our Services",
            menuTitle: "Choose Service",
            services: [
                { id: "srv_web_en", title: "🌐 Website", desc: "Your 24/7 digital store" },
                { id: "srv_app_en", title: "📱 App Dev", desc: "Business in their pocket" },
                { id: "srv_auto_en", title: "⚡ Automation", desc: "Smart WhatsApp Bots" },
                { id: "srv_ads_en", title: "🎯 Meta/Google Ads", desc: "Get ready-to-buy leads" }
            ]
        },
        hi: {
            header: "डिग्रोज़ सॉल्यूशंस 🚀",
            body: "हम बिज़नेस को ब्रांड बनाते हैं।\n\n📈 *ज़्यादा सेल्स*\n⏳ *समय की बचत*\n⭐ *भरोसा बनाएं*\n\nसर्विस चुनें:",
            footer: "नीचे टैप करें",
            button: "हमारी सर्विसेज",
            menuTitle: "सर्विस चुनें",
            services: [
                { id: "srv_web_hi", title: "🌐 वेबसाइट", desc: "आपकी 24/7 डिजिटल दुकान" },
                { id: "srv_app_hi", title: "📱 ऐप डेवलपमेंट", desc: "बिज़नेस ग्राहकों की मुट्ठी में" },
                { id: "srv_auto_hi", title: "⚡ ऑटोमेशन", desc: "स्मार्ट व्हाट्सएप बॉट्स" },
                { id: "srv_ads_hi", title: "🎯 Meta/Google Ads", desc: "ज़्यादा लीड्स और सेल्स" }
            ]
        }
    },

    // 3. SERVICE DETAILS (Minimal words, bullet points)
    serviceDetails: {
        en: {
            srv_web: "*🌐 Website Creation*\n\n✅ *24/7 Open:* Never lose a customer.\n✅ *Trust:* Look like a premium brand.\n✅ *Leads:* Capture data automatically.",
            srv_app: "*📱 App Development*\n\n✅ *Loyalty:* Keep customers coming back.\n✅ *Direct Reach:* Push notifications.\n✅ *Easy Pay:* Smooth in-app purchases.",
            srv_auto: "*⚡ Business Automation*\n\n✅ *0 Delay:* Instant bot replies.\n✅ *Save Time:* No manual typing.\n✅ *Smart CRM:* Manage leads easily.",
            srv_ads: "*🎯 Meta & Google Ads*\n\n✅ *Targeting:* Reach exact buyers.\n✅ *Visibility:* Beat competitors.\n✅ *ROI:* Maximize sales quickly.",

            actionPrompt: "\n\nChoose an option:",
            btnForm: "📝 Give Details",
            btnPay: "💳 Pay Advance",
            btnBack: "🔙 Menu"
        },
        hi: {
            srv_web: "*🌐 वेबसाइट क्रिएशन*\n\n✅ *24/7 ओपन:* कस्टमर कभी वापस नहीं जाएगा।\n✅ *भरोसा:* प्रीमियम ब्रांड लुक।\n✅ *लीड्स:* ऑटोमैटिक डेटा सेव।",
            srv_app: "*📱 ऐप डेवलपमेंट*\n\n✅ *लॉयल्टी:* ग्राहक बार-बार आएंगे।\n✅ *डायरेक्ट पहुंच:* डायरेक्ट नोटिफिकेशन्स।\n✅ *आसान पेमेंट:* सुरक्षित इन-ऐप खरीदारी।",
            srv_auto: "*⚡ बिज़नेस ऑटोमेशन*\n\n✅ *0 देरी:* तुरंत बॉट रिप्लाई।\n✅ *समय बचाएं:* मैन्युअल टाइपिंग बंद।\n✅ *स्मार्ट CRM:* लीड्स मैनेज करें।",
            srv_ads: "*🎯 Meta & Google Ads*\n\n✅ *टारगेटिंग:* सही ग्राहकों तक पहुंच।\n✅ *विजिबिलिटी:* कॉम्पिटिटर्स को पीछे छोड़ें।\n✅ *ज़्यादा मुनाफा:* कम खर्च, ज़्यादा सेल्स।",

            actionPrompt: "\n\nविकल्प चुनें:",
            btnForm: "📝 जानकारी दें",
            btnPay: "💳 एडवांस दें",
            btnBack: "🔙 मेनू"
        }
    },

    // 4. DYNAMIC FORMS (Based on service chosen)
    forms: {
        en: {
            web_app: "*Let's build your platform!* 🚀\n\nReply with:\n🏢 *Business Name:*\n👤 *Owner Name:*\n💰 *Budget:*\n\n_Connecting you with our Web/App Team... ⏳_",
            ads: "*Let's get you leads!* 🎯\n\nReply with:\n🏢 *Business Name:*\n💸 *Daily Ad Budget:*\n📈 *Daily Leads Needed:*\n\n_Connecting you with our Ads Team... ⏳_",
            auto: "*Let's automate your business!* ⚡\n\nReply with:\n🏢 *Business Name:*\n⚙️ *Current Process (Manual/CRM?):*\n💰 *Budget:*\n\n_Connecting you with our Automation Team... ⏳_"
        },
        hi: {
            web_app: "*चलिए आपका प्लेटफॉर्म बनाते हैं!* 🚀\n\nरिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n👤 *मालिक का नाम:*\n💰 *बजट:*\n\n_हम आपको हमारी Web/App टीम से जोड़ रहे हैं... ⏳_",
            ads: "*चलिए लीड्स लाते हैं!* 🎯\n\nरिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n💸 *डेली ऐड बजट:*\n📈 *रोज़ कितनी लीड्स चाहिए:*\n\n_हम आपको हमारी Ads टीम से जोड़ रहे हैं... ⏳_",
            auto: "*चलिए बिज़नेस ऑटोमेट करते हैं!* ⚡\n\nरिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n⚙️ *अभी काम कैसे होता है?*\n💰 *बजट:*\n\n_हम आपको हमारी Automation टीम से जोड़ रहे हैं... ⏳_"
        }
    },

    // 5. PAYMENT LINKS (Brought back)
    paymentMessage: {
        en: (link, team) => `🚀 Great! Secure your slot via our safe Razorpay link:\n\n🔗 *Pay Advance:* ${link}\n\n_Send a screenshot here to connect with our ${team} Team._`,
        hi: (link, team) => `🚀 शानदार! अपना स्लॉट बुक करने के लिए एडवांस जमा करें:\n\n🔗 *पेमेंट लिंक:* ${link}\n\n_स्क्रीनशॉट भेजें और हमारी ${team} टीम से जुड़ें।_`
    },
    paymentUrls: {
        'srv_web': 'https://rzp.io/l/H6dBjYGP',
        'srv_app': 'https://rzp.io/l/amO3XoLb',
        'srv_auto': 'https://rzp.io/l/D2ckFS9g',
        'srv_ads': 'https://rzp.io/l/gmh0viTf'
    }
};

module.exports = content;