import React from 'react';

interface QRCodeIconProps {
  size?: number;
  className?: string;
}

export const QRCodeIcon = ({ size = 24, className = '' }: QRCodeIconProps) => {
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
        <linearGradient id="qrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
      </defs>

      {/* QR Code border */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="url(#qrGradient)"
        strokeWidth="2"
        fill="none"
      />

      {/* QR Code corners */}
      <rect x="5" y="5" width="6" height="6" stroke="url(#qrGradient)" strokeWidth="1.5" fill="none"/>
      <rect x="13" y="5" width="6" height="6" stroke="url(#qrGradient)" strokeWidth="1.5" fill="none"/>
      <rect x="5" y="13" width="6" height="6" stroke="url(#qrGradient)" strokeWidth="1.5" fill="none"/>

      {/* Corner fill */}
      <rect x="7" y="7" width="2" height="2" fill="url(#qrGradient)"/>
      <rect x="15" y="7" width="2" height="2" fill="url(#qrGradient)"/>
      <rect x="7" y="15" width="2" height="2" fill="url(#qrGradient)"/>

      {/* Random pixels */}
      <rect x="13" y="13" width="2" height="2" fill="url(#qrGradient)" opacity="0.6"/>
      <rect x="17" y="13" width="2" height="2" fill="url(#qrGradient)" opacity="0.6"/>
      <rect x="13" y="17" width="2" height="2" fill="url(#qrGradient)" opacity="0.6"/>
      <rect x="15" y="15" width="2" height="2" fill="url(#qrGradient)" opacity="0.6"/>
      <rect x="17" y="17" width="2" height="2" fill="url(#qrGradient)" opacity="0.6"/>
    </svg>
  );
};
