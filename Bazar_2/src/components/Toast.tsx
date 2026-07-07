import React, { useEffect } from 'react';
import '../styles/toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <div className="toast-body">
        <span className={`toast-icon toast-icon-${type}`} aria-hidden="true" />
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose} aria-label="Cerrar notificación">×</button>
      </div>
    </div>
  );
};

export default Toast;
