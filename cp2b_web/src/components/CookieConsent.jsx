import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const STORAGE_KEY = 'cp2b-cookie-consent';

const labels = {
  pt: {
    title: 'Sua privacidade importa',
    description:
      'Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdos. Ao continuar navegando, você concorda com nossa política de privacidade.',
    privacyLink: 'Política de Privacidade',
    emailLabel: 'Receba novidades do CP2b (opcional)',
    emailPlaceholder: 'Seu e-mail',
    acceptAll: 'Aceitar Todos',
    essentialOnly: 'Somente Essenciais',
    successMessage: 'Inscrição realizada com sucesso!',
    lgpdNote:
      'Em conformidade com a LGPD (Lei nº 13.709/2018). Você pode revogar seu consentimento a qualquer momento.',
  },
  en: {
    title: 'Your privacy matters',
    description:
      'We use cookies to improve your experience, analyze traffic, and personalize content. By continuing to browse, you agree to our privacy policy.',
    privacyLink: 'Privacy Policy',
    emailLabel: 'Get CP2b updates (optional)',
    emailPlaceholder: 'Your email',
    acceptAll: 'Accept All',
    essentialOnly: 'Essential Only',
    successMessage: 'Successfully subscribed!',
    lgpdNote:
      'Compliant with LGPD (Law No. 13,709/2018) and GDPR. You may withdraw your consent at any time.',
  },
};

const CookieConsent = () => {
  const { language } = useLanguage();
  const t = labels[language];

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const save = async (consent) => {
    const payload = { consent, timestamp: new Date().toISOString() };
    if (consent === 'all' && email.trim()) {
      try {
        await api.post('/newsletter/subscribe', { email: email.trim() });
        setSubscribed(true);
      } catch (_) {
        // newsletter signup is optional — don't block consent save
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setVisible(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--cp2b-dark, #2D3E40)',
        color: '#fff',
        boxShadow: '0 -4px 24px rgba(45, 62, 64, 0.35)',
        borderTop: '2px solid var(--cp2b-petrol, #335C67)',
      }}
    >
      <div className="container py-3">
        <div className="row g-3 align-items-center">

          {/* Left panel: info */}
          <div className="col-12 col-lg-7">
            <h6 className="fw-bold mb-1" style={{ color: 'var(--cp2b-lime, #A4C639)', fontSize: '0.9rem' }}>
              <i className="bi bi-shield-lock me-2" />
              {t.title}
            </h6>
            <p className="mb-1" style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: 1.5 }}>
              {t.description}
            </p>
            <a
              href="/privacidade"
              style={{ fontSize: '0.75rem', color: 'var(--cp2b-lime, #A4C639)', textDecoration: 'underline' }}
            >
              {t.privacyLink}
            </a>
            <p className="mb-0 mt-1" style={{ fontSize: '0.7rem', color: '#999' }}>
              <i className="bi bi-info-circle me-1" />
              {t.lgpdNote}
            </p>
          </div>

          {/* Right panel: email + buttons */}
          <div className="col-12 col-lg-5">
            <label style={{ fontSize: '0.75rem', color: '#ccc', display: 'block', marginBottom: '0.35rem' }}>
              {t.emailLabel}
            </label>
            {subscribed ? (
              <p className="mb-2" style={{ fontSize: '0.78rem', color: 'var(--cp2b-lime, #A4C639)' }}>
                <i className="bi bi-check-circle me-1" />
                {t.successMessage}
              </p>
            ) : (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="form-control form-control-sm mb-2"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff',
                  fontSize: '0.82rem',
                }}
              />
            )}
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm fw-semibold flex-fill"
                style={{
                  background: 'var(--cp2b-lime, #A4C639)',
                  color: '#1a1a1a',
                  border: 'none',
                  fontSize: '0.8rem',
                }}
                onClick={() => save('all')}
              >
                {t.acceptAll}
              </button>
              <button
                className="btn btn-sm flex-fill"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.28)',
                  color: '#bbb',
                  fontSize: '0.8rem',
                }}
                onClick={() => save('essential')}
              >
                {t.essentialOnly}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
