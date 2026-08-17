const axios = require('axios');
const crypto = require('crypto');

async function generatePaymentLink(amountInRupees, customerPhone) {
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const env = process.env.PHONEPE_ENV || 'PROD';

    // PhonePe expects amount in PAISE (Multiply Rupee by 100)
    const amountInPaise = amountInRupees * 100;

    // Generate a unique Transaction ID (e.g., TXN-1709483021)
    const transactionId = `TXN-${Date.now()}`;

    // 1. Create the Payload Object
    const payload = {
        merchantId: merchantId,
        merchantTransactionId: transactionId,
        merchantUserId: customerPhone, // Linking to customer's WhatsApp number
        amount: amountInPaise,
        redirectUrl: "https://digroz.com", // Where user goes after paying
        redirectMode: "REDIRECT",
        paymentInstrument: {
            type: "PAY_PAGE"
        }
    };

    // 2. Base64 Encode the Payload
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // 3. Create the X-VERIFY Checksum Hash
    const endpoint = "/pg/v1/pay";
    const stringToHash = base64Payload + endpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = `${sha256}###${saltIndex}`;

    // 4. Determine API URL based on Environment
    const API_URL = env === 'PROD'
        ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    try {
        // 5. Make the Request to PhonePe
        const response = await axios.post(API_URL, {
            request: base64Payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': merchantId
            }
        });

        // 6. Return the generated Payment URL
        return response.data.data.instrumentResponse.redirectInfo.url;

    } catch (error) {
        console.error("PhonePe API Error:", error.response?.data || error.message);
        return null; // Return null if it fails
    }
}

module.exports = {
    generatePaymentLink
};