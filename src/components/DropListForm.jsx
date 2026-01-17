import { useState } from 'react';

export default function DropListForm({ onSuccess, autoFocus }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    // Simulate API call & Safe Fallback
    try {
      // In a real app, await api.post('/leads', ...)
      // For now, save to localStorage to ensure data isn't lost during demo
      const currentLeads = JSON.parse(localStorage.getItem('vant_drop_leads') || '[]');
      currentLeads.push({ email, phone, date: new Date().toISOString() });
      localStorage.setItem('vant_drop_leads', JSON.stringify(currentLeads));

      console.log('Drop List Saved locally:', { email, phone });
    } catch (err) {
      console.error('Local save failed', err);
    }

    setTimeout(() => {
      setStatus('success');
      if (onSuccess) onSuccess();
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="success-message">
        <div className="icon">✓</div>
        <h3>You're on the list.</h3>
        <p>Keep an eye on your inbox. We'll notify you before the drop goes live.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="drop-list-form">
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          autoFocus={autoFocus}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number (Optional)</label>
        <input
          type="tel"
          id="phone"
          placeholder="+90 555 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={status === 'loading'}
        />
        <span className="help-text">For SMS alerts on drop day.</span>
      </div>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <button type="submit" className="submit-btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'JOINING...' : 'JOIN THE LIST'}
      </button>

      <style>{`
        .drop-list-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        input {
          background: transparent;
          border: 1px solid var(--color-border);
          padding: 1rem;
          color: var(--color-text);
          font-family: var(--font-body);
          transition: border-color 0.3s;
        }
        input:focus {
          border-color: var(--color-accent);
          outline: none;
        }
        .help-text {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          opacity: 0.7;
        }
        .error-msg {
          color: #ff4d4d;
          font-size: 0.8rem;
        }
        .submit-btn {
          background: var(--color-accent);
          color: #000;
          padding: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s;
          margin-top: 1rem;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-message {
          text-align: center;
          padding: 2rem 0;
          animation: fadeIn 0.5s ease;
        }
        .success-message .icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid var(--color-accent);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 1.5rem;
        }
        .success-message h3 {
          color: var(--color-accent);
          font-family: var(--font-heading);
          margin-bottom: 0.5rem;
        }
        .success-message p {
          color: var(--color-text-muted);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  );
}
