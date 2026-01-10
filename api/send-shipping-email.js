import { Resend } from 'resend';

// Initialize Resend with the API Key from Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // CORS Headers for client-side calling
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
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, trackingNumber, customerName } = req.body;

        if (!email || !trackingNumber) {
            return res.status(400).json({ error: 'Email and Tracking Number are required' });
        }

        const { data, error } = await resend.emails.send({
            from: 'VANT Online <noreply@vantonline.com>', // Or 'onboarding@resend.dev' for testing
            to: [email],
            subject: 'Siparişiniz Yola Çıktı! 📦',
            html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #d4af37; margin: 0;">VANT.</h1>
            </div>
            
            <p>Merhaba ${customerName || 'Müşterimiz'},</p>
            
            <p>Güzel bir haberimiz var! Siparişiniz özenle hazırlandı ve kargoya teslim edildi.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #d4af37; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Kargo Takip Numarası:</p>
                <p style="margin: 5px 0 0 0; font-size: 1.2rem; letter-spacing: 1px;">${trackingNumber}</p>
            </div>
            
            <p>Kargonuzun durumunu kargo firmasının web sitesinden bu numara ile takip edebilirsiniz.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            
            <div style="text-align: center; font-size: 0.8rem; color: #888;">
                <p>&copy; ${new Date().getFullYear()} VANT Online. Tüm hakları saklıdır.</p>
            </div>
        </div>
      `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
