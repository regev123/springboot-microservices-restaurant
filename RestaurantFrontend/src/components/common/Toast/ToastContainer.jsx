import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            zIndex: 9999 - index,
            transform: `translateY(${index * 20}px) scale(${1 - index * 0.05})`,
            opacity: index > 2 ? 0.7 : 1,
          }}
        >
          <Toast {...toast} onClose={() => onRemove(toast.id)} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
