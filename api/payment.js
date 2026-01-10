import Iyzipay from 'iyzipay';

export default async function handler(req, res) {
    // CORS Helper
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { basketItems, user, price, paidPrice, shippingAddress, billingAddress, ip } = req.body;

        // Initialize Iyzico
        const iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY,
            secretKey: process.env.IYZICO_SECRET_KEY,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: '123456789',
            price: price,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            basketId: 'B67832',
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: 'https://vantonline.com/checkout/result', // Update for prod, uses frontend verification/redirection
            enabledInstallments: [2, 3, 6, 9],
            buyer: {
                id: user.id || 'guest',
                name: user.name || 'Misafir',
                surname: user.surname || 'Kullanıcı',
                gsmNumber: user.phone || '+905555555555',
                email: user.email || 'guest@vantonline.com',
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationAddress: billingAddress.address,
                ip: ip || '85.34.78.112',
                city: billingAddress.city,
                country: billingAddress.country,
                zipCode: billingAddress.zipCode
            },
            shippingAddress: {
                contactName: shippingAddress.name,
                city: shippingAddress.city,
                country: shippingAddress.country,
                address: shippingAddress.address,
                zipCode: shippingAddress.zipCode
            },
            billingAddress: {
                contactName: billingAddress.name,
                city: billingAddress.city,
                country: billingAddress.country,
                address: billingAddress.address,
                zipCode: billingAddress.zipCode
            },
            basketItems: basketItems.map(item => ({
                id: item.id,
                name: item.name,
                category1: item.category || 'Jewelry',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: item.price
            }))
        };

        iyzipay.payment.create(request, function (err, result) {
            if (err) {
                return res.status(500).json({ status: 'failure', errorMessage: err.message });
            }
            res.status(200).json(result);
        });

    } catch (error) {
        console.error('Iyzico Init Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
