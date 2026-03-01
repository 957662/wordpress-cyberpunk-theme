interface LoadingIconProps {
  size?: number;
  className?: string;
}

export const LoadingIcon = ({ size = 24, className = '' }: LoadingIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <defs>
        <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff">
            <animate
              attributeName="stop-color"
              values="#00f0ff;#9d00ff;#ff0080;#00f0ff"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#9d00ff">
            <animate
              attributeName="stop-color"
              values="#9d00ff;#ff0080;#00f0ff;#9d00ff"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#loadingGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="40"
        strokeDashoffset="20"
      />

      {/* Inner ring */}
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="#00f0ff"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="25"
        strokeDashoffset="10"
        opacity="0.7"
      />

      {/* Center dot */}
      <circle cx="12" cy="12" r="2" fill="#ff0080">
        <animate
          attributeName="r"
          values="2;3;2"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
