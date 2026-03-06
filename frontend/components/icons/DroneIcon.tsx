'use client';

/**
 * DroneIcon - 无人机图标
 * 表示无人机、航拍、飞行器
 */

interface DroneIconProps {
  size?: number;
  className?: string;
  flying?: boolean;
}

export const DroneIcon = ({
  size = 24,
  className = '',
  flying = true
}: DroneIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(50, 50)">
        {/* 无人机机身动画 */}
        <g>
          {flying && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-5; 0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          )}

          {/* 机身 */}
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="8"
            fill="#16162a"
            stroke="#00f0ff"
            strokeWidth="2"
          />

          {/* 摄像头 */}
          <circle cx="0" cy="5" r="4" fill="#9d00ff" opacity="0.8" />
          <circle cx="0" cy="5" r="2" fill="#ffffff" opacity="0.5" />

          {/* 四个机臂 */}
          <g stroke="#2a2a4a" strokeWidth="3">
            <line x1="-10" y1="-5" x2="-30" y2="-20" />
            <line x1="10" y1="-5" x2="30" y2="-20" />
            <line x1="-10" y1="5" x2="-30" y2="20" />
            <line x1="10" y1="5" x2="30" y2="20" />
          </g>

          {/* 四个旋翼 */}
          <g>
            {/* 左上 */}
            <g transform="translate(-30, -20)">
              <circle cx="0" cy="0" r="8" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3" />
              <ellipse cx="0" cy="0" rx="12" ry="3" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.5">
                {flying && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
            </g>

            {/* 右上 */}
            <g transform="translate(30, -20)">
              <circle cx="0" cy="0" r="8" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3" />
              <ellipse cx="0" cy="0" rx="12" ry="3" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.5">
                {flying && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360"
                    to="0"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
            </g>

            {/* 左下 */}
            <g transform="translate(-30, 20)">
              <circle cx="0" cy="0" r="8" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3" />
              <ellipse cx="0" cy="0" rx="12" ry="3" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.5">
                {flying && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360"
                    to="0"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
            </g>

            {/* 右下 */}
            <g transform="translate(30, 20)">
              <circle cx="0" cy="0" r="8" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3" />
              <ellipse cx="0" cy="0" rx="12" ry="3" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.5">
                {flying && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
            </g>
          </g>

          {/* LED 灯 */}
          <circle cx="-15" cy="0" r="2" fill="#ff0080">
            {flying && (
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="15" cy="0" r="2" fill="#00ff88">
            {flying && (
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>

        {/* 阴影 */}
        <ellipse
          cx="0"
          cy="40"
          rx="20"
          ry="5"
          fill="#000000"
          opacity="0.3"
        >
          {flying && (
            <animate
              attributeName="rx"
              values="20;15;20"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          {flying && (
            <animate
              attributeName="opacity"
              values="0.3;0.2;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>
      </g>
    </svg>
  );
};

export default DroneIcon;
