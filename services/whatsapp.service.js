const axios = require('axios');
const phonepeService = require('./phonepe.service'); // <-- Import PhonePe Service

// Helper Function to trigger the Meta API
async function sendToWhatsApp(payload) {
    const API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    await axios.post(API_URL, payload, {
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
}

// Send Main Menu
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

// Send Details & Pricing based on selection
async function sendServiceDetails(toPhone, serviceId) {
    let detailsText = "";

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



// async function sendPaymentAndReceipt(toPhone) {
//     const paymentText = "Awesome! 🚀 \n\nTo lock in your project, please pay the advance using our secure Razorpay link below:\n\n🔗 *Payment Link:* https://razorpay.me/@digroz \n\n_Once paid, please reply with a screenshot. A formal invoice and project proposal will be emailed to you shortly._";

//     const payload = {
//         messaging_product: "whatsapp",
//         to: toPhone,
//         type: "text",
//         text: {
//             body: paymentText,
//             preview_url: true // This creates a nice clickable preview box for your link in WhatsApp!
//         }
//     };
//     await sendToWhatsApp(payload);
// }


// Collect Payment & Send Receipt dynamically
async function sendPaymentAndReceipt(toPhone) {
    const advanceAmount = 5000; // Fixed advance amount of ₹5,000

    // Call our PhonePe service to generate a secure, one-time link
    const paymentUrl = await phonepeService.generatePaymentLink(advanceAmount, toPhone);

    let paymentText = "";

    if (paymentUrl) {
        // Success: Send the generated link
        paymentText = `Awesome! 🚀\n\nTo lock in your project, please pay the advance of *₹${advanceAmount}* using our secure PhonePe link below:\n\n🔗 ${paymentUrl}\n\n_Once paid, please reply with a screenshot. A formal invoice and project proposal will be emailed to you shortly._`;
    } else {
        // Fallback: If PhonePe API fails for some reason, show UPI ID
        paymentText = `Awesome! 🚀\n\nOur automated link generator is busy. Please pay the advance of *₹${advanceAmount}* directly to our UPI ID:\n\n*UPI ID:* digroz@icici\n\n_Once paid, please reply with a screenshot._`;
    }

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: {
            body: paymentText,
            preview_url: true // Creates a clickable preview box
        }
    };

    await sendToWhatsApp(payload);
}


module.exports = {
    sendMainMenu,
    sendServiceDetails,
    sendPaymentAndReceipt
};