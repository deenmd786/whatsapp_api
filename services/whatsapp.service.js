const axios = require('axios');
// const phonepeService = require('./phonepe.service'); 

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
        detailsText = "*Website Development*\nWe build high-converting, mobile-responsive websites tailored to your brand.\n\n*Total Price:* ₹20,000\n*Advance Required (25%):* ₹5,000";
    } else if (serviceId === 'srv_app') {
        detailsText = "*Apps + Website Bundle*\nCustom applications with a complete website, modern UI/UX, and seamless performance.\n\n*Total Price:* ~₹80,000~ ₹50,000 (Discounted)\n*Advance Required (25%):* ₹12,500";
    } else if (serviceId === 'srv_auto') {
        detailsText = "*Automation + Web + SEO + SMO*\nA complete digital dominance package including CRM workflows, website, and search/social optimization.\n\n*Total Price:* ~₹30,000~ ₹20,000 (Discounted)\n*Advance Required (25%):* ₹5,000";
    } else if (serviceId === 'srv_meta' || serviceId === 'srv_social') {
        detailsText = "*Meta Ads (Facebook & Instagram)*\nHighly targeted ad campaigns to generate quality leads.\n\n*Monthly Price:* ~₹15,000~ ₹8,000 (Discounted)";
    } else if (serviceId === 'srv_google') {
        detailsText = "*Google & YouTube Ads*\nCapture high-intent customers searching for your services right now.\n\n*Monthly Price:* ~₹20,000~ ₹10,000 (Discounted)";
    }

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "interactive",
        interactive: {
            type: "button",
            body: { text: detailsText + "\n\nWould you like to book this service and secure the discounted pricing?" },
            action: {
                buttons: [
                    { type: "reply", reply: { id: `pay_${serviceId}`, title: "Pay Now" } }
                ]
            }
        }
    };
    await sendToWhatsApp(payload);
}

// Collect Payment & Send Specific Razorpay Link
async function sendPaymentAndReceipt(toPhone, serviceId) {
    // CORRECTED RAZORPAY LINKS:
    const paymentLinks = {
        'srv_web': 'https://rzp.io/l/H6dBjYGP',       // ₹5,000 link for website
        'srv_app': 'https://rzp.io/l/amO3XoLb',       // ₹12,500 link for apps and website 
        'srv_auto': 'https://rzp.io/l/D2ckFS9g',      // ₹5,000 link for automation 
        'srv_meta': 'https://rzp.io/l/gmh0viTf',      // ₹8,000 link for meta ads 
        'srv_google': 'https://rzp.io/l/jwTVi03v'     // ₹10,000 link for google and youtube campaigns
    };

    const linkToSend = paymentLinks[serviceId];

    // Just in case a service ID isn't found, we provide a fallback
    if (!linkToSend) {
        console.error(`No link found for service ID: ${serviceId}`);
        return;
    }

    const paymentText = `Awesome! 🚀\n\nTo lock in your project and secure this pricing, please complete your payment using our secure Razorpay link below:\n\n🔗 *Payment Link:* ${linkToSend}\n\n_Once paid, please reply with a screenshot. A formal invoice and project proposal will be emailed to you shortly._`;

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: {
            body: paymentText,
            preview_url: true
        }
    };
    await sendToWhatsApp(payload);
}


// async function sendPaymentAndReceipt(toPhone) {
//     const advanceAmount = 5000; // Fixed advance amount of ₹5,000

//     // Call our PhonePe service to generate a secure, one-time link
//     const paymentUrl = await phonepeService.generatePaymentLink(advanceAmount, toPhone);

//     let paymentText = "";

//     if (paymentUrl) {
//         // Success: Send the generated link
//         paymentText = `Awesome! 🚀\n\nTo lock in your project, please pay the advance of *₹${advanceAmount}* using our secure PhonePe link below:\n\n🔗 ${paymentUrl}\n\n_Once paid, please reply with a screenshot. A formal invoice and project proposal will be emailed to you shortly._`;
//     } else {
//         // Fallback: If PhonePe API fails for some reason, show UPI ID
//         paymentText = `Awesome! 🚀\n\nOur automated link generator is busy. Please pay the advance of *₹${advanceAmount}* directly to our UPI ID:\n\n*UPI ID:* digroz@icici\n\n_Once paid, please reply with a screenshot._`;
//     }

//     const payload = {
//         messaging_product: "whatsapp",
//         to: toPhone,
//         type: "text",
//         text: {
//             body: paymentText,
//             preview_url: true // Creates a clickable preview box
//         }
//     };

//     await sendToWhatsApp(payload);
// }


module.exports = {
    sendMainMenu,
    sendServiceDetails,
    sendPaymentAndReceipt
};