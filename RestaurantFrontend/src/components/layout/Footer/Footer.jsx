import React from 'react';

const Footer = ({
  text = '© 2024 Restaurant App. All rights reserved.',
  className = 'text-center mt-8',
  textClassName = 'text-slate-500 text-sm',
}) => {
  return (
    <div className={className}>
      <p className={textClassName}>{text}</p>
    </div>
  );
};

export default Footer;
