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
