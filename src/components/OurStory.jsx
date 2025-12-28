import { useLanguage } from '../context/LanguageContext';

export default function OurStory() {
    const { t } = useLanguage();

    return (
        <section className="page-section">
            <div className="container">
                <h2 className="section-title">{t('storyTitle')}</h2>
                <div className="story-content">
                    <p className="lead">{t('storyLead')}</p>
                    <p>{t('storyP1')}</p>
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1589128773955-46fd1b79646b?q=80&w=1200" alt="Jewelry Crafting" />
                    </div>
                    <p>{t('storyP2')}</p>
                </div>
            </div>
            <style>{`
                .page-section { padding: 4rem 0; min-height: 70vh; color: var(--color-text); }
                .section-title { font-family: var(--font-heading); text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: var(--color-accent); }
                .story-content { max-width: 800px; margin: 0 auto; text-align: center; }
                .lead { font-size: 1.25rem; font-style: italic; color: var(--color-accent); margin-bottom: 2rem; }
                p { margin-bottom: 1.5rem; line-height: 1.8; color: var(--color-text-muted); }
                .story-image { margin: 3rem 0; }
                .story-image img { width: 100%; border-radius: 4px; filter: grayscale(20%); transition: 0.5s; }
                .story-image img:hover { filter: grayscale(0%); }
            `}</style>
        </section>
    );
}
