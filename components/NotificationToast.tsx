
import React, { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-[#1c1c1e] border border-[#00D1FF] px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,209,255,0.3)] flex items-center gap-3">
        <span className="text-[#00D1FF] text-lg">🔔</span>
        <span className="text-white text-sm font-bold tracking-tight">{message}</span>
      </div>
    </div>
  );
};

export default NotificationToast;
