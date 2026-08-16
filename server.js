require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

// Root health check to prevent 404s
app.get('/', (req, res) => {
    res.send('WhatsApp Webhook Server is Live!');
});

// ==========================================
// 1. Webhook Verification (Required by Meta)
// ==========================================
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('Webhook verified successfully!');
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});

// ==========================================
// 2. Receive Messages & Auto-Reply
// ==========================================
app.post('/webhook', async (req, res) => {
    res.sendStatus(200);

    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const message = change?.value?.messages?.[0];

        if (message?.type === 'text') {
            const senderNumber = message.from;
            const incomingText = message.text.body.toLowerCase();

            console.log(`Received message from ${senderNumber}: ${incomingText}`);

            if (incomingText.includes('hi') || incomingText.includes('hello')) {
                await sendServiceMenu(senderNumber);
            }
        }
    } catch (error) {
        console.error("Webhook Error:", error);
    }
});

// ==========================================
// 3. API Route for the HTML Test Form
// ==========================================
app.post('/api/send-message', async (req, res) => {
    const { recipientNumber, customerName, orderNumber, orderDate } = req.body;

    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientNumber,
        type: "text",
        text: {
            preview_url: false,
            body: `Hello ${customerName}! Your order #${orderNumber} placed on ${orderDate} is confirmed.`
        }
    };

    try {
        const response = await axios.post(API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("Failed to send message:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

// ==========================================
// 4. Interactive List Menu
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
                            { id: "web_static", title: "Static Website", description: "Starting at 20k INR" },
                            { id: "web_dynamic", title: "E-Commerce / Dynamic", description: "Starting at 30k INR" }
                        ]
                    },
                    {
                        title: "Custom Applications",
                        rows: [
                            { id: "service_apps", title: "Mobile App Development", description: "Starting at 50k INR" }
                        ]
                    },
                    {
                        title: "Automation",
                        rows: [
                            { id: "service_auto", title: "WhatsApp & AI Bots", description: "Starting at 20k INR" }
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});