import React from 'react';
import GlassCard from '../GlassCard/GlassCard';
import SectionHeader from '../SectionHeader/SectionHeader';
import Divider from '../Divider/Divider';
import IconAccent from './IconAccent';

/**
 * EmptyStateCard
 * Reusable, modern empty-state card that fits the app's Glass UI.
 */
const EmptyStateCard = ({ title, description, icon, className = '' }) => {
  return (
    <GlassCard className={`mb-8 ${className}`}>
      <div className="flex flex-col items-center text-center py-10">
        {/* Icon / Accent */}
        <IconAccent icon={icon} />

        {/* Title & Description */}
        <SectionHeader title={title} description={description} />

        {/* Divider */}
        <Divider className="mt-4 mb-6" />
      </div>
    </GlassCard>
  );
};

export default EmptyStateCard;
