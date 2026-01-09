import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000 }) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

export default Toast;