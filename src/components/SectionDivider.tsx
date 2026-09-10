import React from 'react';

interface SectionDividerProps {
  label?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 my-6 sm:my-8">
      <div className="flex items-center">
        {/* Left subtle hairline */}
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-ink-200 to-ink-200" />
        
        {/* Center pill badge */}
        {label ? (
          <div className="px-3.5 py-1 bg-white border border-ink-200 rounded-full text-[10px] font-bold text-ink-500 uppercase tracking-widest mx-3">
            {label}
          </div>
        ) : (
          <div className="flex items-center space-x-1 mx-3 text-ink-300">
            <span className="text-xs font-mono font-bold">•</span>
          </div>
        )}

        {/* Right subtle hairline */}
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-ink-200 to-ink-200" />
      </div>
    </div>
  );
};
