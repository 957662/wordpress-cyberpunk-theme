import { SVGProps } from 'react';

export interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Chevron Icon - V形箭头图标
 * 赛博朋克风格的V形箭头
 */
export const ChevronIcon = ({
  size = 24,
  className = '',
  direction = 'down',
  ...props
}: ChevronIconProps) => {
  const points = {
    up: '18,15 12,9 6,15',
    down: '6,9 12,15 18,9',
    left: '15,18 9,12 15,6',
    right: '9,6 15,12 9,18'
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <defs>
        <filter id="chevronGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#chevronGlow)">
        <polyline points={points[direction]} />
      </g>
    </svg>
  );
};
