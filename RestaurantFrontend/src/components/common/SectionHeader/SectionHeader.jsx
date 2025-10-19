import React from 'react';

const SectionHeader = ({
  title,
  description,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className={`text-2xl font-semibold text-white mb-2 ${titleClassName}`}>{title}</h2>
      <p className={`text-slate-400 ${descriptionClassName}`}>{description}</p>
    </div>
  );
};

export default SectionHeader;
