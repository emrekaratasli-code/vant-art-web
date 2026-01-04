import Iyzipay from 'iyzipay';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { basketItems, user, address } = req.body;

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
        return res.status(500).json({ status: 'failure', errorMessage: 'Server Configuration Error: API Keys are missing. Please check Vercel Env Variables.' });
    }

    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: basketItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2),
        paidPrice: basketItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2),
        currency: Iyzipay.CURRENCY.TRY,
        basketId: 'B67832',
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: 'https://vantonline.com/payment-result', // Must be absolute URL
        enabledInstallments: [2, 3, 6, 9],
        buyer: {
            id: 'BY789',
            name: user.name || 'Misafir',
            surname: user.surname || 'Kullanici',
            gsmNumber: address.phone || '+905350000000',
            email: user.email || 'email@email.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: address.addressLine,
            ip: '85.34.78.112',
            city: address.city,
            country: 'Turkey',
            zipCode: address.zipCode || '34732'
        },
        shippingAddress: {
            contactName: user.name + ' ' + user.surname,
            city: address.city,
            country: 'Turkey',
            address: address.addressLine,
            zipCode: address.zipCode || '34732'
        },
        billingAddress: {
            contactName: user.name + ' ' + user.surname,
            city: address.city,
            country: 'Turkey',
            address: address.addressLine,
            zipCode: address.zipCode || '34732'
        },
        basketItems: basketItems.map(item => ({
            id: item.id.toString(),
            name: item.name,
            category1: item.category || 'Jewelry',
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: item.price.toFixed(2)
        }))
    };

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
            return res.status(500).json({ status: 'failure', errorMessage: err });
        }
        res.status(200).json(result);
    });
}
