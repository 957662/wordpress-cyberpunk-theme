'use client';

/**
 * CyberIllustrations - 赛博朋克插画集合
 * 包含各种说明性的赛博朋克风格插画
 */

import React from 'react';

/**
 * ServerRoomIllustration - 服务器机房插画
 */
export const ServerRoomIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景 */}
      <rect width="400" height="300" fill="#0a0a0f" />

      {/* 地面 */}
      <rect x="0" y="250" width="400" height="50" fill="#16162a" opacity="0.5" />

      {/* 服务器机架 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`translate(50 + i * 80, 50)`}>
          {/* 机架外框 */}
          <rect x="0" y="0" width="60" height="200" fill="#16162a" stroke="#2a2a4a" strokeWidth="2" />

          {/* 服务器单元 */}
          {Array.from({ length: 8 }).map((_, j) => (
            <g key={j} transform="translate(5, 10 + j * 23)">
              <rect width="50" height="18" fill="#0a0a0f" stroke="#2a2a4a" strokeWidth="1" />

              {/* LED 指示灯 */}
              <circle cx="10" cy="9" r="2" fill={j % 3 === 0 ? '#00f0ff' : j % 3 === 1 ? '#9d00ff' : '#ff0080'}>
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur={`${1 + Math.random()}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="18" cy="9" r="2" fill={j % 2 === 0 ? '#00ff88' : '#f0ff00'}>
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur={`${1.5 + Math.random()}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* 数据条 */}
              <rect x="25" y="6" width="20" height="6" fill="#2a2a4a" opacity="0.5" />
            </g>
          ))}

          {/* 散热口 */}
          <g transform="translate(10, 195)">
            <line x1="0" y1="0" x2="40" y2="0" stroke="#2a2a4a" strokeWidth="1" />
            <line x1="0" y1="3" x2="40" y2="3" stroke="#2a2a4a" strokeWidth="1" />
          </g>
        </g>
      ))}

      {/* 连接线 */}
      <path
        d="M110 150 Q200 100 290 150"
        stroke="#00f0ff"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        strokeDasharray="5 5"
      />

      {/* 数据流 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <circle
          key={i}
          r="3"
          fill="#00f0ff"
          opacity="0.6"
        >
          <animateMotion
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
            path="M110 150 Q200 100 290 150"
          />
        </circle>
      ))}
    </svg>
  );
};

/**
 * CityscapeIllustration - 赛博城市夜景插画
 */
export const CityscapeIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 天空渐变 */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#050508" />
          <stop offset="100%" stopColor="#16162a" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#skyGradient)" />

      {/* 远景建筑 */}
      <g opacity="0.3">
        <rect x="20" y="150" width="40" height="150" fill="#0a0a0f" />
        <rect x="70" y="120" width="35" height="180" fill="#0a0a0f" />
        <rect x="120" y="180" width="50" height="120" fill="#0a0a0f" />
        <rect x="180" y="140" width="45" height="160" fill="#0a0a0f" />
        <rect x="240" y="160" width="40" height="140" fill="#0a0a0f" />
        <rect x="290" y="130" width="55" height="170" fill="#0a0a0f" />
        <rect x="355" y="170" width="35" height="130" fill="#0a0a0f" />
      </g>

      {/* 主要建筑 */}
      <g>
        {/* 建筑 1 */}
        <g transform="translate(40, 100)">
          <rect width="60" height="200" fill="#16162a" stroke="#00f0ff" strokeWidth="1" opacity="0.8" />
          {/* 窗户 */}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i} transform="translate(10, 15 + i * 18)">
              <rect width="15" height="10" fill="#00f0ff" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
              <rect x="25" width="15" height="10" fill="#00f0ff" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
            </g>
          ))}
          {/* 顶层天线 */}
          <line x1="30" y1="0" x2="30" y2="-30" stroke="#00f0ff" strokeWidth="2" />
          <circle cx="30" cy="-30" r="3" fill="#ff0080">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* 建筑 2 */}
        <g transform="translate(120, 80)">
          <rect width="80" height="220" fill="#16162a" stroke="#9d00ff" strokeWidth="1" opacity="0.8" />
          {/* 窗户 */}
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i} transform="translate(10, 15 + i * 19)">
              <rect width="18" height="12" fill="#9d00ff" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
              <rect x="28" width="18" height="12" fill="#9d00ff" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
              <rect x="56" width="18" height="12" fill="#9d00ff" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
            </g>
          ))}
          {/* 顶层霓虹标志 */}
          <rect x="20" y="-20" width="40" height="15" fill="#ff0080" opacity="0.5" rx="2">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* 建筑 3 */}
        <g transform="translate(220, 120)">
          <rect width="70" height="180" fill="#16162a" stroke="#ff0080" strokeWidth="1" opacity="0.8" />
          {/* 窗户 */}
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i} transform="translate(10, 15 + i * 18)">
              <rect width="20" height="10" fill="#ff0080" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
              <rect x="30" width="20" height="10" fill="#ff0080" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
            </g>
          ))}
        </g>

        {/* 建筑 4 */}
        <g transform="translate(310, 90)">
          <rect width="50" height="210" fill="#16162a" stroke="#f0ff00" strokeWidth="1" opacity="0.8" />
          {/* 窗户 */}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i} transform="translate(8, 15 + i * 19)">
              <rect width="14" height="11" fill="#f0ff00" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
              <rect x="22" width="14" height="11" fill="#f0ff00" opacity={Math.random() > 0.5 ? 0.3 : 0.1} />
            </g>
          ))}
        </g>
      </g>

      {/* 霓虹招牌 */}
      <g transform="translate(150, 60)">
        <text
          x="0"
          y="0"
          fontSize="24"
          fontWeight="bold"
          fill="#00f0ff"
          opacity="0.7"
          fontFamily="monospace"
        >
          CYBER
        </text>
        <text
          x="80"
          y="0"
          fontSize="24"
          fontWeight="bold"
          fill="#9d00ff"
          opacity="0.7"
          fontFamily="monospace"
        >
          CITY
        </text>
      </g>

      {/* 飞行器 */}
      <g>
        <ellipse cx="50" cy="40" rx="8" ry="3" fill="#ff0080" opacity="0.6">
          <animate
            attributeName="cx"
            values="-20;420"
            dur="8s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="200" cy="60" rx="6" ry="2" fill="#00f0ff" opacity="0.4">
          <animate
            attributeName="cx"
            values="-20;420"
            dur="6s"
            begin="2s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      {/* 街道 */}
      <rect x="0" y="290" width="400" height="10" fill="#0a0a0f" />
      <line x1="0" y1="295" x2="400" y2="295" stroke="#00f0ff" strokeWidth="2" opacity="0.3" strokeDasharray="20 10" />
    </svg>
  );
};

/**
 * DataCenterIllustration - 数据中心插画
 */
export const DataCenterIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景 */}
      <rect width="400" height="300" fill="#0a0a0f" />

      {/* 地板网格 */}
      <defs>
        <pattern id="floorGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" stroke="#2a2a4a" strokeWidth="0.5" fill="none" opacity="0.3" />
        </pattern>
      </defs>
      <rect x="0" y="200" width="400" height="100" fill="url(#floorGrid)" />

      {/* 服务器机柜 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <g key={i} transform={`translate(60 + i * 110, 50)`}>
          {/* 机柜外框 */}
          <rect x="0" y="0" width="90" height="150" fill="#16162a" stroke="#00f0ff" strokeWidth="2" rx="5" />

          {/* 机柜门 */}
          <rect x="5" y="5" width="80" height="140" fill="#0a0a0f" stroke="#2a2a4a" strokeWidth="1" rx="3" />

          {/* 服务器单元 */}
          {Array.from({ length: 6 }).map((_, j) => (
            <g key={j} transform="translate(10, 15 + j * 22)">
              <rect width="70" height="18" fill="#16162a" stroke="#2a2a4a" strokeWidth="1" rx="2" />

              {/* LED 指示灯 */}
              <circle cx="15" cy="9" r="2" fill={j % 2 === 0 ? '#00f0ff' : '#9d00ff'}>
                <animate
                  attributeName="opacity"
                  values="1;0.5;1"
                  dur={`${1 + j * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="22" cy="9" r="2" fill={j % 3 === 0 ? '#00ff88' : '#ff0080'}>
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur={`${1.5 + j * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* 数据显示条 */}
              <rect x="35" y="6" width="30" height="6" fill="#2a2a4a" opacity="0.5" rx="1" />
            </g>
          ))}

          {/* 机柜编号 */}
          <text x="45" y="145" fontSize="10" fill="#00f0ff" opacity="0.5" textAnchor="middle" fontFamily="monospace">
            SRV-{String(i + 1).padStart(2, '0')}
          </text>
        </g>
      ))}

      {/* 连接线缆 */}
      <path
        d="M105 125 L200 180 L295 125"
        stroke="#00f0ff"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
        strokeDasharray="5 5"
      />

      {/* 数据流动画 */}
      <circle r="3" fill="#00f0ff" opacity="0.8">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path="M105 125 L200 180 L295 125"
        />
      </circle>

      {/* 环境照明 */}
      <circle cx="105" cy="50" r="60" fill="#00f0ff" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.1;0.05" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="215" cy="50" r="60" fill="#9d00ff" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.1;0.05" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="325" cy="50" r="60" fill="#ff0080" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.1;0.05" dur="3s" begin="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

/**
 * NetworkGlobeIllustration - 网络地球插画
 */
export const NetworkGlobeIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景 */}
      <rect width="400" height="300" fill="#0a0a0f" />

      {/* 地球经纬线 */}
      <g transform="translate(200, 150)">
        {/* 纬线 */}
        {[-80, -50, -20, 20, 50, 80].map((lat, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="0"
            rx={100 * Math.cos((lat * Math.PI) / 180)}
            ry="100"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1"
            opacity="0.2"
            transform={`rotate(${lat} 0 0)`}
          />
        ))}

        {/* 经线 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="0"
            rx="100"
            ry="100"
            fill="none"
            stroke="#9d00ff"
            strokeWidth="1"
            opacity="0.2"
            transform={`rotate(${i * 30} 0 0)`}
          />
        ))}

        {/* 大陆轮廓（简化） */}
        <path
          d="M-60 -40 Q-30 -60 0 -40 Q30 -20 60 -40"
          stroke="#00f0ff"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M-50 20 Q-20 40 10 20 Q40 0 70 20"
          stroke="#00f0ff"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />

        {/* 网络节点 */}
        {[
          { x: -50, y: -30 },
          { x: 30, y: -50 },
          { x: 60, y: 20 },
          { x: -40, y: 40 },
          { x: 20, y: 30 },
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r="5" fill="#ff0080" opacity="0.8">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#ff0080" strokeWidth="1" opacity="0.3">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0;0.3"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* 连接线 */}
        <g stroke="#00f0ff" strokeWidth="1" opacity="0.3" strokeDasharray="3 3">
          <line x1="-50" y1="-30" x2="30" y2="-50" />
          <line x1="30" y1="-50" x2="60" y2="20" />
          <line x1="60" y1="20" x2="20" y2="30" />
          <line x1="20" y1="30" x2="-40" y2="40" />
          <line x1="-40" y1="40" x2="-50" y2="-30" />
        </g>

        {/* 数据流动 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={i}
            r="2"
            fill="#ffffff"
            opacity="0.8"
          >
            <animateMotion
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              path="M-50 -30 L30 -50 L60 20 L20 30 L-40 40 L-50 -30"
            />
          </circle>
        ))}
      </g>

      {/* 轨道环 */}
      <ellipse
        cx="200"
        cy="150"
        rx="140"
        ry="140"
        fill="none"
        stroke="#9d00ff"
        strokeWidth="1"
        opacity="0.2"
        transform="rotate(-15 200 150)"
      />
      <ellipse
        cx="200"
        cy="150"
        rx="160"
        ry="160"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="1"
        opacity="0.15"
        transform="rotate(20 200 150)"
      />
    </svg>
  );
};

export default CyberIllustrations;
