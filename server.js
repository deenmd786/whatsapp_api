require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

// Root health check
app.get('/', (req, res) => res.send('Digroz Webhook Server Live!'));

// 1. Webhook Verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});

// 2. Main Webhook Handler
app.post('/webhook', async (req, res) => {
    res.sendStatus(200); // Acknowledge Meta immediately

    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const message = change?.value?.messages?.[0];

        // Extract the user's WhatsApp Name automatically!
        const customerName = change?.value?.contacts?.[0]?.profile?.name || "Customer";

        if (message) {
            const senderNumber = message.from;

            // STEP 1: If they send ANY text message, greet them and show the menu
            if (message.type === 'text') {
                await sendMainMenu(senderNumber, customerName);
            }

            // STEP 2 & 3: If they click a List Option or a Button
            if (message.type === 'interactive') {
                const interactiveType = message.interactive.type;

                // Handle Service Selection (List Reply)
                if (interactiveType === 'list_reply') {
                    const serviceId = message.interactive.list_reply.id;
                    await sendServiceDetails(senderNumber, serviceId);
                }

                // Handle Payment Button (Button Reply)
                if (interactiveType === 'button_reply') {
                    const buttonId = message.interactive.button_reply.id;
                    if (buttonId.startsWith('pay_')) {
                        await sendPaymentAndReceipt(senderNumber);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
});

// ==========================================
// AUTOMATION FUNCTIONS
// ==========================================

// Function 1: Send Main Menu
async function sendMainMenu(toPhone, name) {
    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "list",
            header: { type: "text", text: "Digroz Agency" },
            body: { text: `Hi ${name}! 👋\n\nDigroz is a premium digital marketing agency. We help brands grow online. Please select a service below to see details and pricing:` },
            footer: { text: "Tap below to view services" },
            action: {
                button: "Our Services",
                sections: [{
                    title: "Select a Service",
                    rows: [
                        { id: "srv_web", title: "1. Website Development" },
                        { id: "srv_app", title: "2. App Development" },
                        { id: "srv_auto", title: "3. Business Automation" },
                        { id: "srv_meta", title: "4. Meta Ads" },
                        { id: "srv_google", title: "5. Google Ads" },
                        { id: "srv_social", title: "6. Social Media Ads" }
                    ]
                }]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// Function 2: Send Details & Pricing based on selection
async function sendServiceDetails(toPhone, serviceId) {
    let detailsText = "";

    // Define the 2-3 lines of details and prices
    if (serviceId === 'srv_web') {
        detailsText = "*Website Development*\nWe build high-converting, mobile-responsive websites tailored to your brand.\n\n*Pricing:* Starts at ₹20,000 for static sites, up to ₹50,000 for complex E-commerce.";
    } else if (serviceId === 'srv_app') {
        detailsText = "*App Development*\nCustom iOS and Android applications with modern UI/UX and seamless performance.\n\n*Pricing:* Starts at ₹50,000 depending on features.";
    } else if (serviceId === 'srv_auto') {
        detailsText = "*Business Automation*\nSave time with WhatsApp chatbots, CRM integrations, and lead-nurturing workflows.\n\n*Pricing:* Starts at ₹20,000 setup fee.";
    } else if (serviceId === 'srv_meta' || serviceId === 'srv_social') {
        detailsText = "*Meta & Social Media Ads*\nHighly targeted ad campaigns on Facebook, Instagram, and LinkedIn to generate quality leads.\n\n*Pricing:* ₹15,000/month retainer + Ad Spend.";
    } else if (serviceId === 'srv_google') {
        detailsText = "*Google Ads*\nCapture high-intent customers searching for your services right now on Google.\n\n*Pricing:* ₹15,000/month retainer + Ad Spend.";
    }

    // Send the details along with a "Pay Advance" button
    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "button",
            body: { text: detailsText + "\n\nWould you like to book this service by paying an advance?" },
            action: {
                buttons: [
                    { type: "reply", reply: { id: `pay_${serviceId}`, title: "Pay Advance Now" } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// Function 3: Collect Payment & Send Receipt
async function sendPaymentAndReceipt(toPhone) {
    // In a real scenario, you can generate a dynamic UPI link or Razorpay link here
    const paymentText = "Awesome! 🚀 \n\nTo lock in your project, please pay the advance using the UPI details below:\n\n*UPI ID:* digroz@icici\n\n_Once paid, please reply with a screenshot. A formal invoice and project proposal will be emailed to you shortly._";

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: { body: paymentText }
    };
    await sendToWhatsApp(payload);
}

// Helper Function to trigger the Meta API
async function sendToWhatsApp(payload) {
    await axios.post(API_URL, payload, {
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));