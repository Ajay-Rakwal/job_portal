import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const NotificationToast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div className={`toast show align-items-center border-0 shadow-lg ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center gap-2 fw-semibold">
            {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};
