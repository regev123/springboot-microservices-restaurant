import React from 'react';

const BrandSection = ({
  title = 'Restaurant App',
  subtitle = 'Welcome back to your dashboard',
  logo = '🍴',
  showLogo = true,
  logoSize = 'w-16 h-16',
  titleSize = 'text-3xl',
  className = '',
}) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      {showLogo && (
        <div
          className={`inline-flex items-center justify-center ${logoSize} bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/25`}
        >
          <span className="text-2xl">{logo}</span>
        </div>
      )}
      <h1 className={`${titleSize} font-bold mb-2`} style={{ color: '#94a3b8' }}>
        {title}
      </h1>
      <p className="text-slate-400 text-sm font-medium">{subtitle}</p>
    </div>
  );
};

export default BrandSection;
