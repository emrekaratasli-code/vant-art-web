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
    // IMPORTANT: Using .trim() to remove any accidental whitespace from environment variables
    const rawApiKey = process.env.IYZICO_API_KEY || 'sandbox-MXKXqHwU299kZjL1Un2qKvsklLNyW7XD';
    const rawSecretKey = process.env.IYZICO_SECRET_KEY || 'sandbox-yqUC6FplVjzaYL8k4U0aZ7Tz8KGi4YsR';
    const rawBaseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

    const API_KEY = rawApiKey.trim();
    const SECRET_KEY = rawSecretKey.trim();
    const BASE_URL = rawBaseUrl.trim();

    // DEBUG: Print details about the keys being used to initialize Iyzipay
    console.log('Iyzico Initialization Details:', {
        apiKeyLength: API_KEY.length,
        apiKeyPrefix: API_KEY.substring(0, 12) + '...', // Show a bit more to be sure
        secretKeyLength: SECRET_KEY.length,
        baseUrl: BASE_URL
    });

    if (!API_KEY || !SECRET_KEY) {
        console.error('CRITICAL: Missing Iyzico API Keys.');
        return res.status(500).json({
            status: 'failure',
            errorMessage: 'Server Configuration Error: Iyzico keys missing.',
            errorCode: '1001'
        });
    }

    const { cartItems, userDetails, totalPrice, currency } = req.body;

    const iyzipayConfig = {
        apiKey: API_KEY,
        secretKey: SECRET_KEY,
        uri: BASE_URL,
        // Defensive: Add snake_case aliases just in case specific library version expects them
        api_key: API_KEY,
        secret_key: SECRET_KEY,
        sandbox: true // Explicitly enable sandbox mode if supported
    };

    console.log('Iyzipay Constructor Config:', {
        ...iyzipayConfig,
        apiKey: '***MASKED***',
        secretKey: '***MASKED***',
        api_key: '***MASKED***',
        secret_key: '***MASKED***'
    });

    const iyzipay = new Iyzipay(iyzipayConfig);

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
            // Return the exact error message from Iyzico with a DEBUG marker to prove new code is running
            return res.status(400).json({
                status: 'failure',
                errorMessage: 'DEBUG_ACTIVE: ' + result.errorMessage,
                errorCode: result.errorCode,
                errorGroup: result.errorGroup
            });
        }

        res.status(200).json(result);
    });
}
