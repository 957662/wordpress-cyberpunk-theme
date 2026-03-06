/**
 * 动态 Open Graph 图片生成
 * 用于社交分享
 */

import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Orbitron, sans-serif',
        }}
      >
        {/* 装饰元素 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(transparent 50%, rgba(0, 240, 255, 0.03) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* 中心六边形 */}
        <div
          style={{
            width: 120,
            height: 120,
            border: '3px solid #00f0ff',
            transform: 'rotate(30deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              border: '2px solid #9d00ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#00f0ff',
                textShadow: '0 0 20px #00f0ff',
              }}
            >
              C
            </span>
          </div>
        </div>

        {/* 标题 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 20,
            textShadow: '0 0 30px #00f0ff, 0 0 60px #9d00ff',
          }}
        >
          CYBERPRESS
        </div>

        {/* 副标题 */}
        <div
          style={{
            fontSize: 28,
            color: '#9d00ff',
            marginBottom: 10,
          }}
        >
          赛博朋克风格博客平台
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 18,
            color: '#4a4a6a',
            fontFamily: 'monospace',
          }}
        >
          cyberpress.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
