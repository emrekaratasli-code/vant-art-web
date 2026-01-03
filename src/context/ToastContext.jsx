import { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <Toast message={toast} />}
        </ToastContext.Provider>
    );
};

const Toast = ({ message }) => {
    return (
        <div className="toast-notification">
            <span className="icon">✓</span>
            <span className="message">{message}</span>
            <style>{`
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(10, 10, 10, 0.9);
                    backdrop-filter: blur(10px);
                    color: #fff;
                    padding: 0.8rem 1.5rem;
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    border: 1px solid rgba(212, 175, 55, 0.3); /* Gold border */
                    z-index: 2200;
                    animation: slideDown 0.3s ease-out;
                    min-width: 250px;
                    justify-content: center;
                }
                .toast-notification .icon {
                    background: var(--color-accent);
                    color: #000;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                .toast-notification .message {
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
