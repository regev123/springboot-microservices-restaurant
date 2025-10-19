import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ type = 'info', message, duration = 5000, onClose, showProgress = true }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(100);

    if (showProgress && duration > 0) {
      const progressInterval = setInterval(() => {
        if (!isPaused) {
          setProgress((prev) => {
            const newProgress = prev - 100 / (duration / 50);
            return newProgress <= 0 ? 0 : newProgress;
          });
        }
      }, 50);

      const closeTimer = setTimeout(() => {
        if (!isPaused) {
          handleClose();
        }
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(closeTimer);
      };
    }
  }, [duration, showProgress, isPaused]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleMouseEnter = () => {
    if (showProgress) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (showProgress) {
      setIsPaused(false);
    }
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-emerald-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-emerald-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-400';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-amber-400';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-400';
    }
  };

  return (
    <div
      className={`
        fixed top-[5vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2
        z-[9999] min-w-[320px] max-w-[420px] w-fit
        bg-slate-900/95 backdrop-blur-2xl
        border border-white/10 border-l-4 ${getBorderColor()}
        rounded-xl shadow-2xl shadow-black/40
        text-white text-sm leading-relaxed
        overflow-hidden
        animate-[slideInCenter_0.3s_cubic-bezier(0.16,1,0.3,1)]
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-3xl hover:shadow-black/50
        hover:border-white/15
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">{getIcon()}</div>
        <div className="flex-1 font-medium break-words">{message}</div>
        <button
          className="flex-shrink-0 bg-transparent border-none text-white/60 
                     hover:text-white/90 hover:bg-white/10 
                     cursor-pointer p-1 rounded-md 
                     flex items-center justify-center w-6 h-6
                     transition-all duration-200 ease-in-out
                     hover:scale-110"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      {showProgress && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-75 ease-linear`}
            style={{
              width: `${progress}%`,
              transition: isPaused ? 'none' : 'width 50ms linear',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
