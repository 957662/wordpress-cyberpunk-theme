/**
 * File Icon - 赛博朋克风格
 *
 * Usage:
 * <FileIcon size={24} variant="cyan" />
 * <FileIcon size={32} variant="purple" animated={true} />
 */

interface FileIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const FileIcon: React.FC<FileIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`file-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* File body */}
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#file-glow-${variant}-${size})`}
      />

      {/* Folded corner */}
      <path
        d="M14 2V8H20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Tech lines */}
      <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="16" x2="16" y2="16" stroke={color} strokeWidth="1" opacity="0.6" />

      {/* Corner accent */}
      <circle cx="16" cy="18" r="1" fill={color} opacity="0.8" />
    </svg>
  );
};

export default FileIcon;
