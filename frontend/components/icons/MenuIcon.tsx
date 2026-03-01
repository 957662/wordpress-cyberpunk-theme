interface MenuIconProps {
  size?: number;
  className?: string;
  isOpen?: boolean;
}

export const MenuIcon = ({ size = 24, className = '', isOpen = false }: MenuIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
      </defs>

      {!isOpen ? (
        // Hamburger menu
        <>
          <rect x="2" y="5" width="20" height="2" rx="1" fill="url(#menuGradient)"/>
          <rect x="2" y="11" width="20" height="2" rx="1" fill="url(#menuGradient)"/>
          <rect x="2" y="17" width="20" height="2" rx="1" fill="url(#menuGradient)"/>
        </>
      ) : (
        // Close X
        <>
          <rect x="4" y="11" width="16" height="2" rx="1" fill="url(#menuGradient)" transform="rotate(45 12 12)"/>
          <rect x="4" y="11" width="16" height="2" rx="1" fill="url(#menuGradient)" transform="rotate(-45 12 12)"/>
        </>
      )}
    </svg>
  );
};
