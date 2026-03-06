'use client';

/**
 * CloudUploadIcon - 云端上传图标
 * 表示云存储、上传、同步
 */

interface CloudUploadIconProps {
  size?: number;
  className?: string;
  uploading?: boolean;
}

export const CloudUploadIcon = ({
  size = 24,
  className = '',
  uploading = false
}: CloudUploadIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 云朵轮廓 */}
      <path
        d="M25 65 C15 65 10 60 10 50 C10 40 18 35 25 35 C25 25 35 20 45 20 C55 20 65 25 70 35 C80 35 90 40 90 50 C90 60 80 65 75 65 L25 65Z"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 云朵内部渐变 */}
      <path
        d="M25 62 C18 62 13 58 13 50 C13 42 20 38 25 38 C25 30 33 25 42 25 C50 25 58 30 62 38 C70 38 78 42 78 50 C78 58 70 62 65 62 L25 62Z"
        fill="url(#cloudGradient)"
        opacity="0.3"
      />

      {/* 上传箭头 */}
      <g transform="translate(50, 50)">
        <path
          d="M0 -15 L0 15"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M-8 -7 L0 -15 L8 -7"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {uploading && (
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>

      {/* 数据包（上传时显示） */}
      {uploading && (
        <>
          <circle cx="30" cy="30" r="3" fill="#9d00ff" opacity="0">
            <animate
              attributeName="cy"
              values="30;50"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="70" cy="35" r="3" fill="#ff0080" opacity="0">
            <animate
              attributeName="cy"
              values="35;50"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      <defs>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CloudUploadIcon;
