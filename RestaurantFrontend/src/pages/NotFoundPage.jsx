import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* 404 Number with enhanced design */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[180px] font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-20 blur-sm">
              404
            </h1>
          </div>
          <h1 className="relative text-9xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Main message card with enhanced design */}
        <div className="bg-slate-800/60 backdrop-blur-2xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl mb-8 relative overflow-hidden transform transition-all hover:scale-[1.02]">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4 px-6 py-3 border-2 border-white/40 rounded-xl bg-white/10 backdrop-blur-sm inline-block drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Page Not Found
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full mt-6"></div>
            <p className="text-xl text-slate-300 mb-3 font-medium">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-base text-slate-500 leading-relaxed">
              It might have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>
        </div>

        {/* Enhanced decorative elements */}
        <div className="flex justify-center gap-3 mb-10">
          <div className="relative">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50"
              style={{ animationDelay: '0s' }}
            ></div>
            <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="relative">
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="absolute inset-0 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
          <div className="relative">
            <div
              className="w-3 h-3 bg-pink-500 rounded-full animate-bounce shadow-lg shadow-pink-500/50"
              style={{ animationDelay: '0.4s' }}
            ></div>
            <div
              className="absolute inset-0 w-3 h-3 bg-pink-500 rounded-full animate-ping opacity-75"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>

        {/* Action buttons with enhanced styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            text="Go Back"
            icon="arrow-left"
            onClick={() => navigate(-1)}
            variant="secondary"
            className="!min-w-[160px] !h-14 text-base"
          />
          <Button
            text="Go Home"
            icon="home"
            onClick={() => navigate('/home')}
            variant="primary"
            className="!min-w-[160px] !h-14 text-base"
          />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
