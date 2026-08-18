// Helper to get time-based greeting for both languages
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { en: 'Good Morning', hi: 'सुप्रभात' };
    if (hour < 18) return { en: 'Good Afternoon', hi: 'नमस्कार' };
    return { en: 'Good Evening', hi: 'शुभ संध्या' };
};

const content = {
    // STEP 1: Ultra-short bilingual welcome
    welcome: (name) => {
        const time = getGreeting();
        return `*Welcome to Digroz Agency* 🚀\n\n${time.en}, ${name}!\n${time.hi}, ${name}!\n\nPlease choose your language:\nकृपया अपनी भाषा चुनें:`;
    },

    // STEP 2: Main Menu & Introduction (Now with bullet points)
    menu: {
        en: {
            header: "Digroz Agency Solutions",
            body: "We help small businesses transform into trusted online brands. Here is how we help you grow:\n\n• *Stop chasing clients:* We build systems that bring them to you.\n• *Build Authority:* Make your brand look premium.\n• *Automate Sales:* Save time while your business grows online.\n\n*Please select a service you need below:*",
            footer: "Tap below to explore",
            button: "Grow My Business",
            menuTitle: "Growth Solutions",
            services: [
                { id: "srv_web_en", title: "🌐 Website Creation", desc: "A 24/7 store that gets clients" },
                { id: "srv_app_en", title: "📱 App Development", desc: "Put your business in their pockets" },
                { id: "srv_auto_en", title: "⚡ Business Auto", desc: "Save time with smart bots" },
                { id: "srv_meta_en", title: "🎯 Meta Ads", desc: "Reach people ready to buy" },
                { id: "srv_google_en", title: "📈 Google Ads", desc: "Be #1 on Google searches" }
            ]
        },
        hi: {
            header: "डिग्रोज़ एजेंसी सॉल्यूशंस",
            body: "हम छोटे व्यवसायों को एक भरोसेमंद ऑनलाइन ब्रांड बनने में मदद करते हैं। देखिए हम कैसे आपकी मदद करते हैं:\n\n• *ग्राहकों के पीछे भागना छोड़ें:* हम ऐसा सिस्टम बनाते हैं जिससे ग्राहक खुद आपके पास आएं।\n• *ब्रांड वैल्यू बढ़ाएं:* अपने बिज़नेस को एक प्रीमियम लुक दें।\n• *ऑटोमेटिक सेल्स:* ऑनलाइन ग्रोथ के साथ अपना कीमती समय बचाएं।\n\n*कृपया नीचे से अपनी ज़रूरत की सर्विस चुनें:*",
            footer: "सर्विस देखने के लिए नीचे टैप करें",
            button: "बिजनेस बढ़ाएं",
            menuTitle: "हमारी सर्विसेज",
            services: [
                { id: "srv_web_hi", title: "🌐 वेबसाइट डेवलपमेंट", desc: "24/7 चलने वाली आपकी डिजिटल दुकान" },
                { id: "srv_app_hi", title: "📱 ऐप डेवलपमेंट", desc: "अपने बिजनेस को ग्राहकों की मुट्ठी में लाएं" },
                { id: "srv_auto_hi", title: "⚡ बिजनेस ऑटोमेशन", desc: "समय बचाएं, बॉट्स को काम करने दें" },
                { id: "srv_meta_hi", title: "🎯 Meta Ads", desc: "खरीदारी के लिए तैयार ग्राहकों तक पहुंचें" },
                { id: "srv_google_hi", title: "📈 Google Ads", desc: "गूगल सर्च में सबसे ऊपर दिखें" }
            ]
        }
    },

    // STEP 3: Service Details (Focusing on HOW it helps with Bullet Points)
    serviceDetails: {
        en: {
            srv_web: "*🌐 How a Website Grows Your Business:*\n\n• *24/7 Availability:* Your business never closes. Customers can reach you anytime.\n• *Instant Trust:* A professional site makes you look established and reliable.\n• *Showcase Services:* Easily display your best work and customer reviews.\n• *Generate Leads:* Capture customer details automatically.",
            srv_app: "*📱 How an App Grows Your Business:*\n\n• *Direct Access:* Stay on your customer's phone screen 24/7.\n• *Push Notifications:* Send instant updates and offers directly to them.\n• *Brand Loyalty:* Customers prefer businesses with easy-to-use apps.\n• *Faster Payments:* Seamless in-app purchases.",
            srv_auto: "*⚡ How Automation Grows Your Business:*\n\n• *Zero Delay:* WhatsApp bots reply to clients instantly, so you don't lose them.\n• *Save Hours of Work:* Stop typing the same replies manually.\n• *Organized Leads:* CRM systems track every customer journey automatically.",
            srv_meta: "*🎯 How Meta Ads Grow Your Business:*\n\n• *Targeted Reach:* Show your ads only to people interested in your specific service.\n• *Visual Appeal:* Catch attention on Instagram/Facebook with great designs.\n• *High ROI:* Get more leads for less money compared to traditional marketing.",
            srv_google: "*📈 How Google Ads Grow Your Business:*\n\n• *High Intent:* Reach people exactly when they search for your service on Google.\n• *Beat Competitors:* Appear above older, bigger businesses in search results.\n• *Pay for Results:* Only pay when someone actually clicks your ad.",
            actionPrompt: "\n\nWould you like to get a custom quote for this?",
            btnProceed: "📝 Get Custom Quote",
            btnBack: "🔙 Main Menu"
        },
        hi: {
            srv_web: "*🌐 वेबसाइट आपके बिज़नेस को कैसे बढ़ाती है:*\n\n• *24/7 उपलब्धता:* आपका बिज़नेस कभी बंद नहीं होता। ग्राहक किसी भी समय जुड़ सकते हैं।\n• *तुरंत भरोसा:* एक प्रोफेशनल वेबसाइट आपको एक बड़ा और भरोसेमंद ब्रांड दिखाती है।\n• *सर्विस शोकेस:* अपने बेहतरीन काम और कस्टमर रिव्यू आसानी से दिखाएं।\n• *ऑटोमेटिक लीड्स:* ग्राहकों की जानकारी अपने आप सेव करें।",
            srv_app: "*📱 ऐप आपके बिज़नेस को कैसे बढ़ाता है:*\n\n• *सीधी पहुंच:* हमेशा अपने ग्राहकों के फोन स्क्रीन पर रहें।\n• *पुश नोटिफिकेशन्स:* ऑफर्स और अपडेट्स सीधे ग्राहकों तक भेजें।\n• *ब्रांड लॉयल्टी:* ग्राहक आसान ऐप वाले बिज़नेस को ज़्यादा पसंद करते हैं।\n• *तेज़ पेमेंट:* ऐप के अंदर ही आसान और सुरक्षित खरीदारी।",
            srv_auto: "*⚡ ऑटोमेशन आपके बिज़नेस को कैसे बढ़ाता है:*\n\n• *तुरंत रिप्लाई:* व्हाट्सएप बॉट ग्राहकों को तुरंत जवाब देता है, जिससे कोई डील मिस नहीं होती।\n• *समय की बचत:* बार-बार एक ही मैसेज टाइप करने की झंझट खत्म।\n• *ऑर्गनाइज़्ड डेटा:* CRM सिस्टम हर ग्राहक का रिकॉर्ड अपने आप रखता है।",
            srv_meta: "*🎯 Meta Ads आपके बिज़नेस को कैसे बढ़ाते हैं:*\n\n• *सही ग्राहकों तक पहुंच:* आपका ऐड सिर्फ उन्हीं को दिखेगा जिन्हें आपकी सर्विस की ज़रूरत है।\n• *विज़ुअल अपील:* इंस्टाग्राम/फेसबुक पर बेहतरीन डिज़ाइन से ध्यान खींचें।\n• *ज़्यादा मुनाफा:* पुराने मार्केटिंग तरीकों के मुकाबले कम खर्च में ज़्यादा लीड्स पाएं।",
            srv_google: "*📈 Google Ads आपके बिज़नेस को कैसे बढ़ाते हैं:*\n\n• *सही समय पर पहुंच:* जब लोग गूगल पर आपकी सर्विस ढूंढें, तब आप उन्हें दिखें।\n• *कॉम्पिटिशन को हराएं:* सर्च रिज़ल्ट्स में अपने से बड़ी कंपनियों के ऊपर दिखें।\n• *रिज़ल्ट पर पैसे दें:* जब कोई आपके ऐड पर क्लिक करे, तभी पैसे कटेंगे।",
            actionPrompt: "\n\nक्या आप इसके लिए कस्टम कोटेशन लेना चाहते हैं?",
            btnProceed: "📝 कोटेशन प्राप्त करें",
            btnBack: "🔙 मेनू पर जाएं"
        }
    },

    // STEP 4: The Lead Form / Questionnaire
    leadQuestions: {
        en: "Great choice! ✨\n\nTo give you the exact pricing and strategy, we just need a few details. Please reply with:\n\n1️⃣ *Your Name:*\n2️⃣ *Business / Service Name:*\n3️⃣ *Estimated Budget:*\n\n_Just type your answers in a single message and hit send! Our team will get back to you shortly._",
        hi: "बेहतरीन चुनाव! ✨\n\nआपको सही कीमत और प्लान बताने के लिए, हमें कुछ जानकारी चाहिए। कृपया रिप्लाई में बताएं:\n\n1️⃣ *आपका नाम:*\n2️⃣ *आपके बिज़नेस / सर्विस का नाम:*\n3️⃣ *आपका अनुमानित बजट:*\n\n_बस अपने जवाब एक ही मैसेज में टाइप करें और भेज दें! हमारी टीम जल्द ही आपसे संपर्क करेगी।_"
    }
};

module.exports = content;