import { useEffect } from 'react';
import DropListForm from './DropListForm';

export default function DropListModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>

        <div className="modal-header">
          <h2>EARLY ACCESS</h2>
          <p>Sign up for limited drops and exclusive studio updates.</p>
        </div>

        <div className="form-wrapper">
          <DropListForm autoFocus={true} />
        </div>

      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-content {
          background: #0a0a0a;
          border: 1px solid var(--color-border);
          padding: 3rem 2rem;
          width: 100%;
          max-width: 500px;
          position: relative;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--color-text);
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }
        .modal-header {
          margin-bottom: 2rem;
        }
        .modal-header h2 {
          font-family: var(--font-heading);
          color: var(--color-accent);
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .modal-header p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
