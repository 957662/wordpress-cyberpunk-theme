/**
 * CyberPress Graphics Showcase
 *
 * 图形素材使用示例组件
 * 展示 Logo、图标和背景图案的实际应用
 */

import React from 'react';
import Image from 'next/image';
import {
  CyberGlitchIcon,
  CyberMatrixIcon,
  CyberHoloIcon,
  CyberNodeIcon,
  CyberShieldIcon,
  CyberDataIcon
} from '../icons/cyber-icons';

export const GraphicsShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] p-8">
      {/* 页面标题 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#00f0ff] mb-4">
          CyberPress 图形素材展示
        </h1>
        <p className="text-[#a0a0b0]">
          赛博朋克风格设计系统
        </p>
      </div>

      {/* Logo 展示区 */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#00f0ff] mb-6">Logo 资源</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 主 Logo */}
          <div className="bg-[#16162a] rounded-lg p-8 border border-[#2a2a4a]">
            <h3 className="text-lg font-medium text-[#e0e0e0] mb-4">主 Logo (200×200)</h3>
            <div className="flex justify-center items-center h-48 bg-[#0a0a0f] rounded-lg">
              <Image
                src="/logos/cyberpress-logo.svg"
                alt="CyberPress Logo"
                width={200}
                height={200}
              />
            </div>
          </div>

          {/* 图标版 */}
          <div className="bg-[#16162a] rounded-lg p-8 border border-[#2a2a4a]">
            <h3 className="text-lg font-medium text-[#e0e0e0] mb-4">图标版 (64×64)</h3>
            <div className="flex justify-center items-center h-48 bg-[#0a0a0f] rounded-lg">
              <Image
                src="/logos/cyberpress-logo-icon.svg"
                alt="CyberPress Icon"
                width={64}
                height={64}
              />
            </div>
          </div>

          {/* 方形版 */}
          <div className="bg-[#16162a] rounded-lg p-8 border border-[#2a2a4a]">
            <h3 className="text-lg font-medium text-[#e0e0e0] mb-4">方形版 (512×512)</h3>
            <div className="flex justify-center items-center h-48 bg-[#0a0a0f] rounded-lg">
              <Image
                src="/logos/cyberpress-logo-square.svg"
                alt="CyberPress Square"
                width={128}
                height={128}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 自定义图标展示区 */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#00f0ff] mb-6">赛博图标组件</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CyberGlitchIcon */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a] hover:border-[#00f0ff] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <CyberGlitchIcon size={48} color="#00f0ff" />
              <div>
                <h3 className="text-lg font-medium text-[#e0e0e0]">故障图标</h3>
                <p className="text-sm text-[#a0a0b0]">CyberGlitchIcon</p>
              </div>
            </div>
            <p className="text-sm text-[#606070]">用于错误、警告或装饰效果</p>
          </div>

          {/* CyberMatrixIcon */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a] hover:border-[#00f0ff] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <CyberMatrixIcon size={48} color="#00f0ff" animated={true} />
              <div>
                <h3 className="text-lg font-medium text-[#e0e0e0]">矩阵图标</h3>
                <p className="text-sm text-[#a0a0b0]">CyberMatrixIcon</p>
              </div>
            </div>
            <p className="text-sm text-[#606070]">数据流、代码雨效果</p>
          </div>

          {/* CyberHoloIcon */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a] hover:border-[#00f0ff] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <CyberHoloIcon size={48} color="#00f0ff" />
              <div>
                <h3 className="text-lg font-medium text-[#e0e0e0]">全息图标</h3>
                <p className="text-sm text-[#a0a0b0]">CyberHoloIcon</p>
              </div>
            </div>
            <p className="text-sm text-[#606070]">全息投影、VR 效果</p>
          </div>

          {/* CyberNodeIcon */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a] hover:border-[#00f0ff] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <CyberNodeIcon size={48} color="#00f0ff" connected={true} />
              <div>
                <h3 className="text-lg font-medium text-[#e0e0e0]">节点图标</h3>
                <p className="text-sm text-[#a0a0b0]">CyberNodeIcon</p>
              </div>
            </div>
            <p className="text-sm text-[#606070]">网络、区块链连接</p>
          </div>

          {/* CyberShieldIcon */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a] hover:border-[#00f0ff] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <CyberShieldIcon size={48} color="#00f0ff" secure={true} />
              <div>
                <h3 className="text-lg font-medium text-[#e0e0e0]">安全图标</h3>
                <p className="text-sm text-[#a0a0b0]">CyberShieldIcon</p>
              </div>
            </div>
            <p className="text-sm text-[#606070]">安全、加密、认证</p>
          </div>

          {/* CyberDataIcon */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a] hover:border-[#00f0ff] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <CyberDataIcon size={48} color="#00f0ff" loading={false} />
              <div>
                <h3 className="text-lg font-medium text-[#e0e0e0]">数据图标</h3>
                <p className="text-sm text-[#a0a0b0]">CyberDataIcon</p>
              </div>
            </div>
            <p className="text-sm text-[#606070]">数据库、存储、处理</p>
          </div>
        </div>
      </section>

      {/* 背景图案展示区 */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#00f0ff] mb-6">背景图案</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 赛博网格 */}
          <div className="rounded-lg overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-40 bg-[#0a0a0f]"
              style={{
                backgroundImage: 'url(/patterns/cyber-grid.svg)',
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="bg-[#16162a] p-4">
              <h3 className="text-lg font-medium text-[#e0e0e0]">赛博网格</h3>
              <p className="text-sm text-[#a0a0b0]">cyber-grid.svg</p>
            </div>
          </div>

          {/* 扫描线 */}
          <div className="rounded-lg overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-40 bg-[#0a0a0f]"
              style={{
                backgroundImage: 'url(/patterns/scanlines.svg)',
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="bg-[#16162a] p-4">
              <h3 className="text-lg font-medium text-[#e0e0e0]">扫描线</h3>
              <p className="text-sm text-[#a0a0b0]">scanlines.svg</p>
            </div>
          </div>

          {/* 六边形 */}
          <div className="rounded-lg overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-40 bg-[#0a0a0f]"
              style={{
                backgroundImage: 'url(/patterns/hexagons.svg)',
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="bg-[#16162a] p-4">
              <h3 className="text-lg font-medium text-[#e0e0e0]">六边形</h3>
              <p className="text-sm text-[#a0a0b0]">hexagons.svg</p>
            </div>
          </div>

          {/* 电路板 */}
          <div className="rounded-lg overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-40 bg-[#0a0a0f]"
              style={{
                backgroundImage: 'url(/patterns/circuit.svg)',
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="bg-[#16162a] p-4">
              <h3 className="text-lg font-medium text-[#e0e0e0]">电路板</h3>
              <p className="text-sm text-[#a0a0b0]">circuit.svg</p>
            </div>
          </div>

          {/* 粒子 */}
          <div className="rounded-lg overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-40 bg-[#0a0a0f]"
              style={{
                backgroundImage: 'url(/patterns/particles.svg)',
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="bg-[#16162a] p-4">
              <h3 className="text-lg font-medium text-[#e0e0e0]">粒子效果</h3>
              <p className="text-sm text-[#a0a0b0]">particles.svg</p>
            </div>
          </div>
        </div>
      </section>

      {/* 配色展示区 */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#00f0ff] mb-6">配色方案</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '赛博青', color: '#00f0ff', rgb: 'rgb(0, 240, 255)' },
            { name: '赛博紫', color: '#9d00ff', rgb: 'rgb(157, 0, 255)' },
            { name: '激光粉', color: '#ff0080', rgb: 'rgb(255, 0, 128)' },
            { name: '电压黄', color: '#f0ff00', rgb: 'rgb(240, 255, 0)' },
            { name: '深空黑', color: '#0a0a0f', rgb: 'rgb(10, 10, 15)' },
            { name: '卡片黑', color: '#16162a', rgb: 'rgb(22, 22, 42)' },
            { name: '成功绿', color: '#00ff88', rgb: 'rgb(0, 255, 136)' },
            { name: '错误红', color: '#ff0040', rgb: 'rgb(255, 0, 64)' },
          ].map((color) => (
            <div key={color.name} className="bg-[#16162a] rounded-lg p-4 border border-[#2a2a4a]">
              <div
                className="h-24 rounded mb-3"
                style={{
                  backgroundColor: color.color,
                  boxShadow: `0 0 20px ${color.color}80`
                }}
              />
              <h3 className="text-lg font-medium text-[#e0e0e0]">{color.name}</h3>
              <p className="text-xs text-[#a0a0b0] font-mono">{color.color}</p>
              <p className="text-xs text-[#606070] font-mono">{color.rgb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 使用代码示例 */}
      <section>
        <h2 className="text-2xl font-semibold text-[#00f0ff] mb-6">代码示例</h2>
        <div className="space-y-4">
          {/* Logo 使用 */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a]">
            <h3 className="text-lg font-medium text-[#e0e0e0] mb-3">使用 Logo</h3>
            <pre className="bg-[#0a0a0f] rounded p-4 text-sm text-[#a0a0b0] overflow-x-auto">
{`import Image from 'next/image';

<Image
  src="/logos/cyberpress-logo.svg"
  alt="CyberPress"
  width={200}
  height={200}
/>`}
            </pre>
          </div>

          {/* 图标使用 */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a]">
            <h3 className="text-lg font-medium text-[#e0e0e0] mb-3">使用图标</h3>
            <pre className="bg-[#0a0a0f] rounded p-4 text-sm text-[#a0a0b0] overflow-x-auto">
{`import { CyberGlitchIcon } from '@/components/icons/cyber-icons';

<CyberGlitchIcon size={24} color="#00f0ff" className="" />`}
            </pre>
          </div>

          {/* 背景使用 */}
          <div className="bg-[#16162a] rounded-lg p-6 border border-[#2a2a4a]">
            <h3 className="text-lg font-medium text-[#e0e0e0] mb-3">使用背景图案</h3>
            <pre className="bg-[#0a0a0f] rounded p-4 text-sm text-[#a0a0b0] overflow-x-auto">
{`/* CSS */
.cyber-bg {
  background-color: #0a0a0f;
  background-image: url('/patterns/cyber-grid.svg');
  background-repeat: repeat;
}

/* Tailwind */
<div className="bg-[#0a0a0f]" style={{
  backgroundImage: 'url(/patterns/cyber-grid.svg)'
}}>
  内容
</div>`}
            </pre>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="mt-16 text-center text-[#606070] text-sm">
        <p>CyberPress Platform - 图形素材展示</p>
        <p className="mt-2">设计者: AI 图形设计师 | 2026-03-03</p>
      </footer>
    </div>
  );
};

export default GraphicsShowcase;
