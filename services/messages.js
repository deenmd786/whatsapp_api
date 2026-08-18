// Helper for dynamic time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { en: 'Good Morning', hi: 'सुप्रभात' };
    if (hour < 18) return { en: 'Good Afternoon', hi: 'नमस्कार' };
    return { en: 'Good Evening', hi: 'शुभ संध्या' };
};

const content = {
    // -------------------------------------------------------------
    // STEP 1: Quick Bilingual Welcome
    // -------------------------------------------------------------
    welcome: (name) => {
        const time = getGreeting();
        return `*Welcome to Digroz Agency* 🚀\n\n${time.en}, ${name}! 👋\n${time.hi}, ${name}! 👋\n\nChoose language / भाषा चुनें:`;
    },

    // -------------------------------------------------------------
    // STEP 2: Main Menu (5 Distinct Services)
    // -------------------------------------------------------------
    menu: {
        en: {
            header: "Digroz Solutions 🚀",
            body: "We scale businesses into trusted digital brands.\n\n📈 *More Sales & Leads*\n⏳ *Automate Daily Operations*\n⭐ *Premium Brand Authority*\n\nSelect a service to view plans & deliverables:",
            footer: "Tap below to view solutions",
            button: "View Services",
            menuTitle: "Our Core Services",
            services: [
                { id: "srv_web_en", title: "🌐 Website Development", desc: "Starting @ ₹20,000 (Full Setup)" },
                { id: "srv_app_en", title: "📱 App & Web Software", desc: "Custom iOS, Android & Dashboards" },
                { id: "srv_auto_en", title: "⚡ Business Automation", desc: "WhatsApp Bots, CRMs & Workflows" },
                { id: "srv_meta_en", title: "🎯 Meta Ads (FB & Insta)", desc: "Starting @ ₹8,000 / month" },
                { id: "srv_google_en", title: "📈 Google & YouTube Ads", desc: "Starting @ ₹10,000 / month" }
            ]
        },
        hi: {
            header: "डिग्रोज़ सॉल्यूशंस 🚀",
            body: "हम आपके बिजनेस को एक भरोसेमंद ब्रांड बनाते हैं।\n\n📈 *ज्यादा सेल्स और लीड्स*\n⏳ *ऑटोमेशन से समय की बचत*\n⭐ *प्रीमियम ब्रांड वैल्यू*\n\nप्लान और प्राइसिंग देखने के लिए सर्विस चुनें:",
            footer: "नीचे टैप करें",
            button: "सर्विस देखें",
            menuTitle: "हमारी सर्विसेज",
            services: [
                { id: "srv_web_hi", title: "🌐 वेबसाइट डेवलपमेंट", desc: "शुरुआत ₹20,000 से (कंप्लीट सेटअप)" },
                { id: "srv_app_hi", title: "📱 ऐप और वेब सॉफ्टवेयर", desc: "कस्टम iOS, Android और डैशबोर्ड" },
                { id: "srv_auto_hi", title: "⚡ बिजनेस ऑटोमेशन", desc: "व्हाट्सएप बॉट्स, CRM और वर्कफ़्लो" },
                { id: "srv_meta_hi", title: "🎯 Meta Ads (FB & Insta)", desc: "शुरुआत ₹8,000 / महीना" },
                { id: "srv_google_hi", title: "📈 Google & YouTube Ads", desc: "शुरुआत ₹10,000 / महीना" }
            ]
        }
    },

    // -------------------------------------------------------------
    // STEP 3: Deliverables & Pricing Structure
    // -------------------------------------------------------------
    serviceDetails: {
        en: {
            srv_web: "*🌐 High-Converting Business Website*\n\n💰 *Pricing:* Starts @ *₹20,000*\n\n*Included Deliverables:*\n• 📄 4 Custom Animated Pages (Modern UI/UX)\n• 🌐 Free Domain & Fast Hosting (1 Year)\n• 🔒 Free SSL Certificate & Speed Optimization\n• 🔍 Basic On-Page SEO & Google Indexing\n• 💬 WhatsApp Chat & Lead Form Integration\n• 📱 100% Mobile & Desktop Responsive",

            srv_app: "*📱 Custom App & Web Development*\n\n💰 *Pricing:* Custom Scope (Starts @ *₹45,000*)\n\n*Included Deliverables:*\n• 📲 Android / iOS Cross-Platform Apps\n• 🖥️ Centralized Admin Control Dashboard\n• 💳 Payment Gateway Setup (UPI, Cards, NetBanking)\n• ☁️ Secure Cloud Database Architecture\n• 🔔 Push Notifications & User Management",

            srv_auto: "*⚡ Business Automation & WhatsApp Bot*\n\n💰 *Pricing:* Starts @ *₹12,000*\n\n*Included Deliverables:*\n• 🤖 24/7 WhatsApp Interactive Chatbot\n• 📊 Google Sheets / CRM Auto-Lead Sync\n• ⚡ Instant Customer Inquiries Handling\n• 🔄 Automated Order / Booking Follow-ups",

            srv_meta: "*🎯 Meta Ads (Facebook & Instagram)*\n\n💰 *Service Fee:* Starts @ *₹8,000 / month*\n\n*Included Deliverables:*\n• 🎯 Laser-Targeted Audience Research\n• 🖼️ High-Converting Ad Creatives & Copy\n• 📥 Direct-to-WhatsApp / Lead Form Funnels\n• 🧪 A/B Testing & Weekly Performance Reports",

            srv_google: "*📈 Google & YouTube Search Ads*\n\n💰 *Service Fee:* Starts @ *₹10,000 / month*\n\n*Included Deliverables:*\n• 🔍 High-Intent Keyword Strategy (Rank #1)\n• 🎥 YouTube Video Ads & Retargeting Setup\n• 🚫 Negative Keyword Filtering (Save Ad Budget)\n• 📞 Call Ads & High-Conversion Landing Page Setup",

            actionPrompt: "\n\nChoose an option below to proceed:",
            btnPay: "💳 Book / Pay Token",
            btnForm: "📝 Get Custom Quote",
            btnBack: "🔙 Main Menu"
        },
        hi: {
            srv_web: "*🌐 हाई-कन्वर्टिंग बिजनेस वेबसाइट*\n\n💰 *प्राइसिंग:* शुरुआत मात्र *₹20,000* से\n\n*शामिल सुविधाएं:*\n• 📄 4 कस्टम एनिमेटेड पेजेस (मॉडर्न UI/UX)\n• 🌐 फ्री डोमेन और हाई-स्पीड होस्टिंग (1 साल)\n• 🔒 फ्री SSL सिक्योरिटी और फास्ट लोडिंग स्पीड\n• 🔍 बेसिक SEO और गूगल सर्च कंसोल इंडेक्सिंग\n• 💬 डायरेक्ट व्हाट्सएप चैट और लीड फॉर्म इंटीग्रेशन\n• 📱 मोबाइल और कंप्यूटर दोनों के लिए फुली रिस्पॉन्सिव",

            srv_app: "*📱 कस्टम ऐप और वेब डेवलपमेंट*\n\n💰 *प्राइसिंग:* कस्टम स्कोप (शुरुआत *₹45,000* से)\n\n*शामिल सुविधाएं:*\n• 📲 Android और iOS दोनों के लिए कस्टम ऐप\n• 🖥️ सेंट्रलाइज्ड एडमिन मैनेजमेंट डैशबोर्ड\n• 💳 सुरक्षित पेमेंट गेटवे (UPI, कार्ड्स, नेटबैंकिंग)\n• ☁️ सुपरफास्ट और सिक्योर क्लाउड डेटाबेस\n• 🔔 पुश नोटिफिकेशन्स और ऑटो-अलर्ट्स",

            srv_auto: "*⚡ बिजनेस ऑटोमेशन और व्हाट्सएप बॉट*\n\n💰 *प्राइसिंग:* शुरुआत मात्र *₹12,000* से\n\n*शामिल सुविधाएं:*\n• 🤖 24/7 एक्टिव व्हाट्सएप इंटरएक्टिव बॉट\n• 📊 गूगल शीट्स / CRM के साथ ऑटो-लीड सिंक\n• ⚡ ग्राहकों को बिना देरी तुरंत ऑटो-रिप्लाई\n• 🔄 ऑटोमेटेड फॉलो-अप और अलर्ट सिस्टम",

            srv_meta: "*🎯 Meta Ads (Facebook & Instagram)*\n\n💰 *मैनेजमेंट फीस:* मात्र *₹8,000 / महीना*\n\n*शामिल सुविधाएं:*\n• 🎯 एक्टिव बायर्स तक लेजर-टारगेटेड पहुंच\n• 🖼️ हाई-कन्वर्टिंग ऐड ग्राफिक्स और कॉपीराइटिंग\n• 📥 सीधे व्हाट्सएप या लीड फॉर्म पर वेरिफाइड लीड्स\n• 🧪 A/B स्प्लिट टेस्टिंग और वीकली ROI रिपोर्ट",

            srv_google: "*📈 Google & YouTube Ads*\n\n💰 *मैनेजमेंट फीस:* मात्र *₹10,000 / महीना*\n\n*शामिल सुविधाएं:*\n• 🔍 हाई-इंटेंट कीवर्ड्स पर गूगल में टॉप रैंकिंग\n• 🎥 YouTube वीडियो ऐड्स और री-टारगेटिंग\n• 🚫 नेगेटिव कीवर्ड्स फिल्टरिंग (बजट की बर्बादी बंद)\n• 📞 डायरेक्ट कॉल ऐड्स और लैंडिंग पेज गाइडेंस",

            actionPrompt: "\n\nआगे बढ़ने के लिए विकल्प चुनें:",
            btnPay: "💳 स्लॉट बुक / टोकन दें",
            btnForm: "📝 कस्टम कोटेशन लें",
            btnBack: "🔙 मेनू पर जाएं"
        }
    },

    // -------------------------------------------------------------
    // STEP 4: Dynamic Requirement Questionnaires
    // -------------------------------------------------------------
    forms: {
        en: {
            web_app: "*Let's build your project!* 🚀\n\nPlease reply with:\n🏢 *Business Name:*\n👤 *Owner Name:*\n💰 *Estimated Budget:*\n\n_Connecting you with our Web/App Tech Team... ⏳_",
            meta_ads: "*Let's grow with Meta Ads!* 🎯\n\nPlease reply with:\n🏢 *Business Name:*\n💸 *Daily Ad Spend Budget:*\n🎯 *Monthly Leads Target:*\n\n_Connecting you with our Meta Ads Team... ⏳_",
            google_ads: "*Let's dominate Google Search!* 📈\n\nPlease reply with:\n🏢 *Business Name:*\n💸 *Monthly Ad Budget:*\n📍 *Target City / Region:*\n\n_Connecting you with our Google Ads Team... ⏳_",
            auto: "*Let's automate your operations!* ⚡\n\nPlease reply with:\n🏢 *Business Name:*\n⚙️ *Current Lead Handling (Manual/CRM):*\n💰 *Estimated Budget:*\n\n_Connecting you with our Automation Team... ⏳_"
        },
        hi: {
            web_app: "*चलिए आपका प्रोजेक्ट शुरू करते हैं!* 🚀\n\nकृपया रिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n👤 *मालिक का नाम:*\n💰 *अनुमानित बजट:*\n\n_हम आपको हमारी Web/App टीम से जोड़ रहे हैं... ⏳_",
            meta_ads: "*चलिए Meta Ads से सेल्स बढ़ाते हैं!* 🎯\n\nकृपया रिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n💸 *रोज़ाना ऐड खर्च का बजट:*\n🎯 *महीने में कितनी लीड्स चाहिए:*\n\n_हम आपको हमारी Meta Ads टीम से जोड़ रहे हैं... ⏳_",
            google_ads: "*चलिए गूगल पर टॉप रैंक करते हैं!* 📈\n\nकृपया रिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n💸 *महीने का ऐड बजट:*\n📍 *टारगेट शहर / राज्य:*\n\n_हम आपको हमारी Google Ads टीम से जोड़ रहे हैं... ⏳_",
            auto: "*चलिए बिजनेस को ऑटोपायलट पर लाते हैं!* ⚡\n\nकृपया रिप्लाई में बताएं:\n🏢 *बिज़नेस का नाम:*\n⚙️ *लीड्स कैसे संभालते हैं (मैन्युअल/CRM):*\n💰 *अनुमानित बजट:*\n\n_हम आपको हमारी Automation टीम से जोड़ रहे हैं... ⏳_"
        }
    },

    // -------------------------------------------------------------
    // STEP 5: Token Payment Links
    // -------------------------------------------------------------
    paymentUrls: {
        'srv_web': 'https://rzp.io/l/H6dBjYGP',
        'srv_app': 'https://rzp.io/l/amO3XoLb',
        'srv_auto': 'https://rzp.io/l/D2ckFS9g',
        'srv_meta': 'https://rzp.io/l/gmh0viTf',
        'srv_google': 'https://rzp.io/l/jwTVi03v'
    },
    paymentMessage: {
        en: (link, team) => `🚀 *Secure Your Onboarding Slot!*\n\nTo lock your slot and assign our dedicated team, please complete the token advance via our secure Razorpay link:\n\n🔗 *Payment Link:* ${link}\n\n_Reply with a screenshot once completed to instantly connect with our ${team} Team._`,
        hi: (link, team) => `🚀 *अपना ऑनबोर्डिंग स्लॉट सुरक्षित करें!*\n\nप्रोजेक्ट शुरू करने और टीम लॉक करने के लिए नीचे दिए गए सुरक्षित लिंक से टोकन राशि जमा करें:\n\n🔗 *पेमेंट लिंक:* ${link}\n\n_पेमेंट के बाद स्क्रीनशॉट भेजें और सीधे हमारी ${team} टीम से जुड़ें।_`
    }
};

module.exports = content;