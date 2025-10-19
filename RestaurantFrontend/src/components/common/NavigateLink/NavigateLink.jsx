import React from 'react';
import { Link } from 'react-router-dom';

const NavigateLink = ({
  links = [],
  className = '',
  showBorder = true,
  borderColor = 'border-slate-700/50',
  textColor = 'text-slate-400',
  hoverColor = 'hover:text-primary-400',
  alignment = 'center', // center, left, right
}) => {
  const alignmentClasses = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  };

  return (
    <div className={`pt-4 ${showBorder ? `border-t ${borderColor}` : ''} ${className}`}>
      <div className={`${alignmentClasses[alignment]} space-y-2`}>
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className={`${textColor} ${hoverColor} font-medium text-sm transition-all duration-200 hover:underline block`}
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigateLink;
