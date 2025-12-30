import Iyzipay from 'iyzipay';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- CONFIGURATION ---
    // --- CONFIGURATION ---
    // User provided Sandbox Keys (Fallbacks if Env Vars are missing)
    const API_KEY = process.env.IYZICO_API_KEY || 'sandbox-MXKXqHwU299kZjL1Un2qKvsklLNyW7XD';
    const SECRET_KEY = process.env.IYZICO_SECRET_KEY || 'sandbox-yqUC6FplVjzaYL8k4U0aZ7Tz8KGi4YsR';
    const BASE_URL = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

    // DEBUG: Print first few chars of keys to verify they exist (don't log full keys)
    console.log('Iyzico Config Check:', {
        apiKeyExists: !!API_KEY,
        apiKeyPrefix: API_KEY ? API_KEY.substring(0, 4) + '...' : 'MISSING',
        secretKeyExists: !!SECRET_KEY,
        baseUrl: BASE_URL
    });

    if (!API_KEY || !SECRET_KEY) {
        console.error('CRITICAL: Missing Iyzico API Keys in Environment Variables.');
        return res.status(500).json({
            status: 'failure',
            errorMessage: 'Server Configuration Error: Iyzico keys not found. Check Vercel Environment Variables.',
            errorCode: '1001'
        });
    }

    const { cartItems, userDetails, totalPrice, currency } = req.body;

    const iyzipay = new Iyzipay({
        apiKey: API_KEY,
        secretKey: SECRET_KEY,
        uri: BASE_URL
    });

    // Create a unique conversation ID
    const conversationId = '123456789';

    // Calculate basket items
    const basketItems = cartItems.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        category1: item.category || 'Jewelry',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.price.toString()
    }));

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: conversationId,
        price: totalPrice,
        paidPrice: totalPrice, // In a real app, calculate this server-side to prevent tampering
        currency: currency === 'TR' ? Iyzipay.CURRENCY.TRY : Iyzipay.CURRENCY.USD,
        basketId: 'B67832',
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: 'https://vant-art-web.vercel.app/checkout', // Should handle callback
        enabledInstallments: [2, 3, 6, 9],
        buyer: {
            id: 'BY789',
            name: userDetails.fullName.split(' ')[0] || 'John',
            surname: userDetails.fullName.split(' ').slice(1).join(' ') || 'Doe',
            gsmNumber: userDetails.phone || '+905555555555',
            email: userDetails.email || 'email@email.com',
            identityNumber: '11111111111', // Mandatory for TR
            lastLoginDate: '2015-10-05 12:43:35',
            registrationAddress: userDetails.address || 'Nisantasi Istanbul',
            ip: req.headers['x-forwarded-for'] || '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName: userDetails.fullName,
            city: 'Istanbul',
            country: 'Turkey',
            address: userDetails.address || 'Nisantasi, Istanbul',
            zipCode: '34742'
        },
        billingAddress: {
            contactName: userDetails.fullName,
            city: 'Istanbul',
            country: 'Turkey',
            address: userDetails.address || 'Nisantasi, Istanbul',
            zipCode: '34742'
        },
        basketItems: basketItems
    };

    console.log('Iyzico Init Request:', { ...request, apiKey: '***HIDDEN***' });

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
            console.error('Iyzico Connection Error:', err);
            return res.status(500).json({ status: 'failure', errorMessage: err.message });
        }

        console.log('Iyzico API Response:', result);

        if (result.status !== 'success') {
            // Return the exact error message from Iyzico (e.g., "api key validation failed")
            return res.status(400).json({
                status: 'failure',
                errorMessage: result.errorMessage,
                errorCode: result.errorCode,
                errorGroup: result.errorGroup
            });
        }

        res.status(200).json(result);
    });
}
