import React from 'react';

// Icon-only brand mark
export const LogoMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      width="40"
      height="40"
      rx="11"
      fill="#141312"
    />

    <circle
      cx="20"
      cy="20"
      r="12"
      stroke="#FF4A1C"
      strokeWidth="3.2"
      strokeDasharray="50 25"
      strokeLinecap="round"
    />

    <circle
      cx="20"
      cy="20"
      r="4.5"
      fill="#FF4A1C"
    />

    <circle
      cx="28"
      cy="12"
      r="2.2"
      fill="#FFFFFF"
    />
  </svg>
);

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showBadge = false,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }[size];

  const textClasses = {
    sm: 'text-sm',
    md: 'text-[15px]',
    lg: 'text-xl'
  }[size];

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      <div className={`relative ${iconDimensions} flex-shrink-0 group`}>
        <LogoMark className="w-full h-full transition-transform duration-200 group-hover:scale-105" />
      </div>

      {/* Brand Title */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight text-ink-900 leading-none ${textClasses}`}>
            No Debates
          </span>
          {showBadge && (
            <span className="bg-accent-soft text-accent text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border border-accent/20">
              PRO
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
