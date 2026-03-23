import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const InstaIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TiktokIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);
const WhatsappIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);
// Trust Icons (Simple SVGs)
const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const TruckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);
const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
);


export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="luxury-bg footer-section">

            {/* Trust Strip */}
            <div className="trust-strip">
                <div className="trust-item">
                    <LockIcon />
                    <span>SECURE CHECKOUT</span>
                </div>
                <div className="separator">|</div>
                <div className="trust-item">
                    <TruckIcon />
                    <span>FAST SHIPPING</span>
                </div>
                <div className="separator">|</div>
                <div className="trust-item">
                    <RefreshIcon />
                    <span>EASY RETURNS</span>
                </div>
            </div>

            <div className="footer-content">
                <div className="social-links">
                    <a href="https://instagram.com/vantartonline" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><InstaIcon /></a>
                    <a href="https://tiktok.com/@vant.taki.aksesuar" target="_blank" rel="noreferrer" className="social-icon" aria-label="TikTok"><TiktokIcon /></a>
                    <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="WhatsApp"><WhatsappIcon /></a>
                </div>

                <div className="footer-nav">
                    <Link to="/our-story">{t('navStory')}</Link>
                    <Link to="/contact">{t('navContact')}</Link>
                </div>

                <div className="footer-legal">
                    <Link to="/sozlesmeler/mesafeli-satis" className="legal-link">{t('legalSalesAgreement')}</Link>
                    <Link to="/sozlesmeler/iptal-iade" className="legal-link">{t('legalReturnPolicy')}</Link>
                    <Link to="/sozlesmeler/gizlilik" className="legal-link">{t('legalPrivacyPolicy')}</Link>
                    <Link to="/sozlesmeler/kvkk" className="legal-link">{t('legalKvkk')}</Link>
                </div>

                {/* Payment Logos - iyzico Merchant Criteria */}
                <div className="payment-logos">
                    {/* Visa Logo */}
                    <div className="payment-logo" title="Visa">
                        <svg width="48" height="16" viewBox="0 0 750 471" xmlns="http://www.w3.org/2000/svg">
                            <path d="M278.198 334.228l33.36-195.76h53.358l-33.384 195.76h-53.334zm246.11-191.54c-10.57-3.97-27.18-8.21-47.91-8.21-52.83 0-90.03 26.78-90.26 65.14-.25 28.34 26.52 44.14 46.77 53.58 20.78 9.65 27.77 15.82 27.68 24.45-.14 13.21-16.58 19.24-31.93 19.24-21.35 0-32.69-2.98-50.21-10.34l-6.88-3.13-7.49 44.13c12.46 5.49 35.52 10.25 59.45 10.49 56.22 0 92.71-26.47 93.07-67.39.18-22.43-14.03-39.5-44.83-53.56-18.66-9.12-30.09-15.19-29.97-24.43 0-8.19 9.67-16.95 30.56-16.95 17.44-.28 30.09 3.55 39.94 7.54l4.78 2.27 7.23-42.8zm137.31-4.22h-41.32c-12.81 0-22.39 3.52-28.03 16.37l-79.49 181.19h56.17s9.18-24.32 11.26-29.67h68.63c1.6 6.94 6.5 29.67 6.5 29.67h49.66l-43.38-197.56zm-65.95 127.37c4.44-11.41 21.41-55.31 21.41-55.31-.32.53 4.41-11.47 7.12-18.91l3.63 17.08s10.28 47.31 12.44 57.22h-44.6v-.08zM246.058 138.468l-52.24 133.5-5.57-27.27c-9.71-31.42-39.94-65.46-73.78-82.47l47.94 172.07 56.59-.07 84.17-195.76h-57.11" fill="#1A1F71"/>
                            <path d="M152.408 138.468h-86.2l-.68 4.07c67.09 16.35 111.49 55.82 129.87 103.26l-18.73-90.59c-3.23-12.45-12.6-16.27-24.26-16.74" fill="#F9A533"/>
                        </svg>
                    </div>

                    {/* MasterCard Logo */}
                    <div className="payment-logo" title="Mastercard">
                        <svg width="40" height="26" viewBox="0 0 152 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="50" fill="#EB001B"/>
                            <circle cx="102" cy="50" r="50" fill="#F79E1B"/>
                            <path d="M76 15.57A49.834 49.834 0 0050 50a49.834 49.834 0 0026 34.43A49.834 49.834 0 00102 50a49.834 49.834 0 00-26-34.43z" fill="#FF5F00"/>
                        </svg>
                    </div>

                    {/* iyzico ile Öde Logo */}
                    <div className="payment-logo iyzico-badge" title="iyzico ile Öde">
                        <svg width="70" height="24" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg">
                            <rect width="280" height="96" rx="8" fill="#1E64FF"/>
                            <text x="140" y="42" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">iyzico</text>
                            <text x="140" y="72" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="18">ile Öde</text>
                        </svg>
                    </div>
                </div>

                <div className="copyright">
                    &copy; {new Date().getFullYear()} VANT ART. {t('footerCopyright')}
                </div>
            </div>

            <style>{`
          .footer-section {
            text-align: center;
            border-top: 1px solid var(--color-border);
            margin-top: auto;
            /* background removed to use luxury-bg */
            padding-bottom: 6rem; /* Space for bottom nav */
          }
          
          /* Trust Strip */
          .trust-strip {
             display: flex;
             justify-content: center;
             align-items: center;
             gap: 1.5rem;
             padding: 1.5rem 0;
             border-bottom: 1px solid rgba(255,255,255,0.05);
             margin-bottom: 2rem;
             color: var(--color-text-muted);
             font-size: 0.75rem;
             letter-spacing: 0.15em;
             text-transform: uppercase;
          }
          .trust-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
          }
          .trust-strip .separator {
              opacity: 0.3;
          }

          .footer-content {
              padding: 0 1rem;
          }

          .social-links {
             margin-bottom: 1.5rem;
             display: flex;
             justify-content: center;
             gap: 2rem;
          }
          .social-icon { 
              color: var(--color-text);
              transition: transform 0.3s; 
          }
          .social-icon:hover { 
              transform: scale(1.1); 
              color: var(--color-accent) !important; 
          }

          .footer-nav {
             margin-bottom: 1.5rem;
             display: flex;
             justify-content: center;
             gap: 1.5rem;
             flex-wrap: wrap;
          }
          .footer-nav a {
              color: var(--color-text);
              text-decoration: none;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              font-size: 0.85rem;
          }

          .footer-legal {
             margin-bottom: 1.5rem;
             display: flex;
             justify-content: center;
             gap: 1rem;
             flex-wrap: wrap;
             opacity: 0.7;
          }
          .legal-link {
            color: var(--color-text-muted);
            text-decoration: none;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: color 0.3s;
          }
          .legal-link:hover {
            color: var(--color-accent);
          }

          .payment-logos {
             display: flex;
             justify-content: center;
             align-items: center;
             gap: 1.5rem;
             margin-bottom: 1.5rem;
             padding: 1rem 0;
          }
          .payment-logo {
             display: flex;
             align-items: center;
             opacity: 0.8;
             transition: opacity 0.3s;
          }
          .payment-logo:hover {
             opacity: 1;
          }

          .copyright {
              opacity: 0.5;
              font-size: 0.75rem;
              color: var(--color-text-muted);
          }

          @media (max-width: 600px) {
              .trust-strip {
                  flex-direction: column;
                  gap: 0.8rem;
              }
              .trust-strip .separator { display: none; }
          }
        `}</style>
        </footer>
    );
}
