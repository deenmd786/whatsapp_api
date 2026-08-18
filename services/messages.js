// Helper for dynamic time-based greeting (FIXED FOR INDIAN STANDARD TIME - IST)
const getGreeting = () => {
    const date = new Date();
    // Convert server time to IST (+5:30)
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const istDate = new Date(utc + (3600000 * 5.5));
    const hour = istDate.getHours();

    if (hour < 12) return { en: 'Good Morning', hi: 'सुप्रभात' };
    if (hour < 17) return { en: 'Good Afternoon', hi: 'नमस्कार' };
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
    // STEP 2: Main Menu (Prices Removed)
    // -------------------------------------------------------------
    menu: {
        en: {
            header: "Digroz Solutions 🚀",
            body: "We scale businesses into trusted digital brands.\n\n📈 *More Sales & Leads*\n⏳ *Automate Daily Operations*\n⭐ *Premium Brand Authority*\n\nSelect a service to view deliverables:",
            footer: "Tap below to view solutions",
            button: "View Services",
            menuTitle: "Our Core Services",
            services: [
                { id: "srv_web_en", title: "🌐 Website Development", desc: "High-Converting Custom Websites" },
                { id: "srv_app_en", title: "📱 App & Web Software", desc: "Custom iOS, Android & Dashboards" },
                { id: "srv_auto_en", title: "⚡ Business Automation", desc: "WhatsApp Bots, CRMs & Workflows" },
                { id: "srv_meta_en", title: "🎯 Meta Ads (FB & Insta)", desc: "Targeted Leads & Sales Growth" },
                { id: "srv_google_en", title: "📈 Google & YouTube Ads", desc: "High-Intent Search & Video Campaigns" }
            ]
        },
        hi: {
            header: "डिग्रोज़ सॉल्यूशंस 🚀",
            body: "हम आपके बिजनेस को एक भरोसेमंद ब्रांड बनाते हैं।\n\n📈 *ज्यादा सेल्स और लीड्स*\n⏳ *ऑटोमेशन से समय की बचत*\n⭐ *प्रीमियम ब्रांड वैल्यू*\n\nडिटेल्स देखने के लिए सर्विस चुनें:",
            footer: "नीचे टैप करें",
            button: "सर्विस देखें",
            menuTitle: "हमारी सर्विसेज",
            services: [
                { id: "srv_web_hi", title: "🌐 वेबसाइट डेवलपमेंट", desc: "हाई-कन्वर्टिंग कस्टम वेबसाइट्स" },
                { id: "srv_app_hi", title: "📱 ऐप और वेब सॉफ्टवेयर", desc: "कस्टम iOS, Android और डैशबोर्ड" },
                { id: "srv_auto_hi", title: "⚡ बिजनेस ऑटोमेशन", desc: "व्हाट्सएप बॉट्स, CRM और वर्कफ़्लो" },
                { id: "srv_meta_hi", title: "🎯 Meta Ads (FB & Insta)", desc: "टारगेटेड लीड्स और सेल्स ग्रोथ" },
                { id: "srv_google_hi", title: "📈 Google & YouTube Ads", desc: "हाई-इंटेंट सर्च और वीडियो कैम्पेन्स" }
            ]
        }
    },

    // -------------------------------------------------------------
    // STEP 3: Deliverables (Prices removed, Action button updated)
    // -------------------------------------------------------------
    serviceDetails: {
        en: {
            srv_web: "*🌐 High-Converting Business Website*\n\n*Included Deliverables:*\n• 📄 Custom Animated Pages (Modern UI/UX)\n• 🌐 Free Domain & Fast Hosting (1 Year)\n• 🔒 Free SSL Certificate & Speed Optimization\n• 🔍 Basic On-Page SEO & Google Indexing\n• 💬 WhatsApp Chat & Lead Form Integration\n• 📱 100% Mobile & Desktop Responsive",
            srv_app: "*📱 Custom App & Web Development*\n\n*Included Deliverables:*\n• 📲 Android / iOS Cross-Platform Apps\n• 🖥️ Centralized Admin Control Dashboard\n• 💳 Payment Gateway Setup (UPI, Cards)\n• ☁️ Secure Cloud Database Architecture\n• 🔔 Push Notifications & User Management",
            srv_auto: "*⚡ Business Automation & WhatsApp Bot*\n\n*Included Deliverables:*\n• 🤖 24/7 WhatsApp Interactive Chatbot\n• 📊 Google Sheets / CRM Auto-Lead Sync\n• ⚡ Instant Customer Inquiries Handling\n• 🔄 Automated Order / Booking Follow-ups",
            srv_meta: "*🎯 Meta Ads (Facebook & Instagram)*\n\n*Included Deliverables:*\n• 🎯 Laser-Targeted Audience Research\n• 🖼️ High-Converting Ad Creatives & Copy\n• 📥 Direct-to-WhatsApp / Lead Form Funnels\n• 🧪 A/B Testing & Weekly Performance Reports",
            srv_google: "*📈 Google & YouTube Search Ads*\n\n*Included Deliverables:*\n• 🔍 High-Intent Keyword Strategy (Rank #1)\n• 🎥 YouTube Video Ads & Retargeting Setup\n• 🚫 Negative Keyword Filtering\n• 📞 Call Ads & High-Conversion Landing Page Setup",

            actionPrompt: "\n\nChoose an option below to proceed:",
            btnPrice: "🏷️ Get Best Price",
            btnBack: "🔙 Main Menu"
        },
        hi: {
            srv_web: "*🌐 हाई-कन्वर्टिंग बिजनेस वेबसाइट*\n\n*शामिल सुविधाएं:*\n• 📄 कस्टम एनिमेटेड पेजेस (मॉडर्न UI/UX)\n• 🌐 फ्री डोमेन और हाई-स्पीड होस्टिंग (1 साल)\n• 🔒 फ्री SSL सिक्योरिटी और फास्ट लोडिंग स्पीड\n• 🔍 बेसिक SEO और सर्च कंसोल इंडेक्सिंग\n• 💬 डायरेक्ट व्हाट्सएप चैट और लीड फॉर्म इंटीग्रेशन\n• 📱 मोबाइल और कंप्यूटर दोनों के लिए फुली रिस्पॉन्सिव",
            srv_app: "*📱 कस्टम ऐप और वेब डेवलपमेंट*\n\n*शामिल सुविधाएं:*\n• 📲 Android और iOS दोनों के लिए कस्टम ऐप\n• 🖥️ सेंट्रलाइज्ड एडमिन मैनेजमेंट डैशबोर्ड\n• 💳 सुरक्षित पेमेंट गेटवे (UPI, कार्ड्स)\n• ☁️ सुपरफास्ट और सिक्योर क्लाउड डेटाबेस\n• 🔔 पुश नोटिफिकेशन्स और ऑटो-अलर्ट्स",
            srv_auto: "*⚡ बिजनेस ऑटोमेशन और व्हाट्सएप बॉट*\n\n*शामिल सुविधाएं:*\n• 🤖 24/7 एक्टिव व्हाट्सएप इंटरएक्टिव बॉट\n• 📊 गूगल शीट्स / CRM के साथ ऑटो-लीड सिंक\n• ⚡ ग्राहकों को बिना देरी तुरंत ऑटो-रिप्लाई\n• 🔄 ऑटोमेटेड फॉलो-अप और अलर्ट सिस्टम",
            srv_meta: "*🎯 Meta Ads (Facebook & Instagram)*\n\n*शामिल सुविधाएं:*\n• 🎯 एक्टिव बायर्स तक लेजर-टारगेटेड पहुंच\n• 🖼️ हाई-कन्वर्टिंग ऐड ग्राफिक्स और कॉपीराइटिंग\n• 📥 सीधे व्हाट्सएप या लीड फॉर्म पर वेरिफाइड लीड्स\n• 🧪 A/B स्प्लिट टेस्टिंग और वीकली रिपोर्ट",
            srv_google: "*📈 Google & YouTube Ads*\n\n*शामिल सुविधाएं:*\n• 🔍 हाई-इंटेंट कीवर्ड्स पर गूगल में टॉप रैंकिंग\n• 🎥 YouTube वीडियो ऐड्स और री-टारगेटिंग\n• 🚫 नेगेटिव कीवर्ड्स फिल्टरिंग\n• 📞 डायरेक्ट कॉल ऐड्स और लैंडिंग पेज गाइडेंस",

            actionPrompt: "\n\nआगे बढ़ने के लिए विकल्प चुनें:",
            btnPrice: "🏷️ बेस्ट प्राइस जानें",
            btnBack: "🔙 मेनू पर जाएं"
        }
    },

    // -------------------------------------------------------------
    // STEP 4: The Best Price Form
    // -------------------------------------------------------------
    forms: {
        en: "Great! Let's get you the best price. 🏷️\n\nPlease reply with:\n1️⃣ *Business Type:* (e.g., Real Estate, Clinic, Shop)\n2️⃣ *Estimated Budget:*\n\n_Just type your answers in a single message and hit send! Our team will share a custom quotation immediately._",
        hi: "शानदार! चलिए आपको बेस्ट प्राइस बताते हैं। 🏷️\n\nकृपया रिप्लाई में बताएं:\n1️⃣ *बिज़नेस का प्रकार:* (जैसे- रियल एस्टेट, दुकान, क्लिनिक)\n2️⃣ *अनुमानित बजट:*\n\n_बस अपने जवाब टाइप करें और सेंड करें! हमारी टीम तुरंत आपको एक बेस्ट कोटेशन भेजेगी।_"
    }
};

module.exports = content;