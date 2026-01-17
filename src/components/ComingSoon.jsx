import DropListForm from './DropListForm';
import { useLanguage } from '../context/LanguageContext';

export default function ComingSoon() {
    const { language } = useLanguage();

    return (
        <section className="coming-soon">
            <div className="container">
                <div className="content-wrapper">
                    <div className="header-text">
                        <h2>{language === 'TR' ? 'YAKINDA' : 'COMING SOON'}</h2>
                        <p className="drop-date">{language === 'TR' ? 'ŞUBAT – 1. HAFTA' : 'FEBRUARY – WEEK 1'}</p>
                    </div>

                    <div className="form-wrapper">
                        <DropListForm />
                    </div>

                    <div className="social-proof-placeholder">
                        <div className="proof-item">
                            <span className="proof-label">{language === 'TR' ? 'ATÖLYE' : 'STUDIO'}</span>
                            <p>{language === 'TR' ? 'Her parça elle üretiliyor.' : 'Every piece is handcrafted.'}</p>
                        </div>
                        <div className="proof-divider">/</div>
                        <div className="proof-item">
                            <span className="proof-label">{language === 'TR' ? 'MATERYAL' : 'MATERIALS'}</span>
                            <p>{language === 'TR' ? '925 Gümüş & Doğal Taş' : '925 Silver & Natural Stones'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        .coming-soon {
          padding: 4rem 1rem;
          text-align: center;
          background: var(--color-bg);
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .content-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }
        .header-text h2 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-accent);
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }
        .drop-date {
          font-size: 1.2rem;
          color: var(--color-text);
          margin-bottom: 3rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        .form-wrapper {
          margin-bottom: 4rem;
        }
        .social-proof-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          flex-wrap: wrap;
        }
        .proof-label {
          display: block;
          color: var(--color-accent);
          font-weight: bold;
          margin-bottom: 0.2rem;
        }
        .proof-divider {
          color: var(--color-border);
          font-size: 1.5rem;
          font-weight: 300;
        }
      `}</style>
        </section>
    );
}
