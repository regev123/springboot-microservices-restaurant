import React from 'react';

// Renders the decorative icon/accent used in EmptyStateCard
const IconAccent = ({ icon }) => {
  return (
    <div className="mb-4">
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-300/10 border border-amber-400/30 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(251,191,36,0.5)]">
          <div className="text-amber-300 text-2xl">{icon}</div>
        </div>
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-300/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-indigo-300"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm10.5-4.5a1.5 1.5 0 10-3 0v3a1.5 1.5 0 003 0v-3zM12 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default IconAccent;
