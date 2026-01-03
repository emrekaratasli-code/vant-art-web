import Stripe from 'stripe';

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

    try {
        const { cartItems, userDetails, totalPrice, currency } = req.body;

        // Initialize Stripe with secret key
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey) {
            console.error('STRIPE_SECRET_KEY not found in environment variables');
            return res.status(500).json({
                error: 'Server configuration error: Stripe key missing'
            });
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2024-12-18.acacia',
        });

        // Calculate amount in cents (Stripe uses smallest currency unit)
        const amount = Math.round(totalPrice * 100);

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency === 'TR' ? 'try' : 'usd',
            metadata: {
                customer_name: userDetails.fullName,
                customer_email: userDetails.email,
                customer_phone: userDetails.phone,
                customer_address: userDetails.address,
                order_items: JSON.stringify(cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })))
            },
            description: `Order from ${userDetails.fullName}`,
        });

        console.log('✅ Stripe PaymentIntent created:', paymentIntent.id);

        // Return the client secret to the frontend
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('❌ Stripe Error:', error.message);
        res.status(500).json({
            error: error.message || 'Payment initialization failed'
        });
    }
}
