require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

// ==========================================
// 1. Webhook Verification (Required by Meta)
// ==========================================
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check if the verify token matches what you have in your .env
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('Webhook verified!');
        return res.status(200).send(challenge);
    }
    res.sendStatus(403);
});

// ==========================================
// 2. Receive Messages & Trigger Automation
// ==========================================
app.post('/webhook', async (req, res) => {
    // Meta expects a 200 OK immediately, or they will retry sending the payload
    res.sendStatus(200);

    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const message = change?.value?.messages?.[0];

        // Ensure we actually received a text message
        if (message?.type === 'text') {
            const senderNumber = message.from;
            const incomingText = message.text.body.toLowerCase();

            console.log(`Received message from ${senderNumber}: ${incomingText}`);

            // Trigger automation if they say hi, hello, or come from an ad
            if (incomingText.includes('hi') || incomingText.includes('hello')) {
                await sendServiceMenu(senderNumber);
            }
        }

        // Handle when a user clicks a button from your Interactive List
        if (message?.type === 'interactive') {
            const selectedOptionId = message.interactive.list_reply.id;
            console.log(`User selected: ${selectedOptionId}`);

            // You can add further automation here based on the selected ID
            // e.g., if (selectedOptionId === 'web_dynamic') { send dynamic pricing }
        }

    } catch (error) {
        console.error("Webhook Error:", error);
    }
});

// ==========================================
// 3. The Interactive List Payload
// ==========================================
async function sendServiceMenu(toPhone) {
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "Digroz Agency Services"
            },
            body: {
                text: "Welcome! We build high-performance digital solutions. How can we help you today?"
            },
            footer: {
                text: "Tap the button below to view options."
            },
            action: {
                button: "View Services",
                sections: [
                    {
                        title: "Website Development",
                        rows: [
                            { id: "web_static", title: "Static Website", description: "Fast, single-page sites" },
                            { id: "web_animated", title: "Animated Website", description: "Interactive & engaging" },
                            { id: "web_dynamic", title: "Dynamic Website", description: "Data-driven web apps" },
                            { id: "web_budget", title: "Ask for Budget", description: "Get a custom quote" }
                        ]
                    },
                    {
                        title: "Custom Applications",
                        rows: [
                            { id: "service_apps", title: "App Development", description: "iOS & Android solutions" }
                        ]
                    },
                    {
                        title: "Business Automation",
                        rows: [
                            { id: "service_auto", title: "WhatsApp Automation", description: "Chatbots & workflows" }
                        ]
                    }
                ]
            }
        }
    };

    try {
        await axios.post(API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Service menu sent successfully.");
    } catch (error) {
        console.error("Failed to send menu:", error.response?.data || error.message);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});