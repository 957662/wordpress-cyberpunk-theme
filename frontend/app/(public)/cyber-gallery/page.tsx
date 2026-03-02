/**
 * 赛博朋克组件展示页面
 * 展示所有赛博朋克风格的 UI 组件
 */

import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CyberProgress, CyberCircularProgress, CyberSegmentedProgress } from '@/components/ui/CyberProgress';
import { CyberInput, CyberTextarea, CyberSelect, CyberCheckbox } from '@/components/ui/CyberForm';
import { HoloProjector, HoloCard, HoloButton } from '@/components/effects/HoloProjector';
import { CyberLoader } from '@/components/ui/CyberLoader';
import { motion } from 'framer-motion';
import { Code, Zap, Palette, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: '赛博朋克组件展示',
  description: '展示所有赛博朋克风格的 UI 组件和特效',
};

const progressExamples = [
  { value: 75, color: 'cyan' as const, label: '系统加载' },
  { value: 60, color: 'purple' as const, label: '数据同步' },
  { value: 90, color: 'pink' as const, label: '能量水平' },
  { value: 45, color: 'green' as const, label: '处理进度' },
];

export default function CyberGalleryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6">
              <span className="text-glow-cyan text-cyber-cyan">CYBER</span>
              <span className="text-glow-purple text-cyber-purple">GALLERY</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              赛博朋克风格组件展示
            </p>
          </motion.div>

          {/* 加载器展示 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-glow-cyan">
              加载器
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <div className="text-center space-y-4">
                <CyberLoader type="spinner" size="lg" color="cyan" />
                <p className="text-sm text-gray-400">Spinner</p>
              </div>
              <div className="text-center space-y-4">
                <CyberLoader type="dots" size="lg" color="purple" />
                <p className="text-sm text-gray-400">Dots</p>
              </div>
              <div className="text-center space-y-4">
                <CyberLoader type="bars" size="lg" color="pink" />
                <p className="text-sm text-gray-400">Bars</p>
              </div>
              <div className="text-center space-y-4">
                <CyberLoader type="pulse" size="lg" color="green" />
                <p className="text-sm text-gray-400">Pulse</p>
              </div>
              <div className="text-center space-y-4">
                <CyberLoader type="glitch" size="lg" color="cyan" />
                <p className="text-sm text-gray-400">Glitch</p>
              </div>
              <div className="text-center space-y-4">
                <CyberLoader type="hologram" size="lg" color="purple" />
                <p className="text-sm text-gray-400">Hologram</p>
              </div>
            </div>
          </motion.section>

          {/* 进度条展示 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-glow-purple">
              进度条
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* 线性进度条 */}
              <div className="cyber-card p-6 space-y-6">
                <h3 className="font-display font-bold text-xl mb-4">线性进度条</h3>
                {progressExamples.map((example) => (
                  <CyberProgress
                    key={example.label}
                    value={example.value}
                    color={example.color}
                    label={example.label}
                    showPercentage
                    variant="glow"
                  />
                ))}
              </div>

              {/* 环形进度条 */}
              <div className="cyber-card p-6">
                <h3 className="font-display font-bold text-xl mb-4">环形进度条</h3>
                <div className="flex justify-around">
                  {progressExamples.map((example) => (
                    <div key={example.label} className="text-center">
                      <CyberCircularProgress
                        value={example.value}
                        color={example.color}
                        label={example.label}
                        size={100}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 多段进度条 */}
            <div className="cyber-card p-6 mt-8">
              <h3 className="font-display font-bold text-xl mb-4">多段进度条</h3>
              <CyberSegmentedProgress
                segments={[
                  { value: 30, color: 'cyan', label: '前端' },
                  { value: 25, color: 'purple', label: '后端' },
                  { value: 20, color: 'pink', label: '设计' },
                  { value: 25, color: 'green', label: '测试' },
                ]}
                showLabels
              />
            </div>
          </motion.section>

          {/* 表单组件展示 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-glow-pink">
              表单组件
            </h2>
            <div className="cyber-card p-8 space-y-6 max-w-2xl">
              <CyberInput
                label="用户名"
                placeholder="请输入用户名"
                color="cyan"
                icon={<Code className="w-4 h-4" />}
                helperText="3-20个字符"
              />

              <CyberInput
                label="密码"
                type="password"
                placeholder="请输入密码"
                color="purple"
                helperText="至少8个字符"
              />

              <CyberInput
                label="邮箱"
                type="email"
                placeholder="your@email.com"
                color="pink"
                error="请输入有效的邮箱地址"
              />

              <CyberTextarea
                label="个人简介"
                placeholder="介绍一下你自己..."
                rows={4}
                color="green"
              />

              <CyberSelect
                label="选择主题"
                color="cyan"
                options={[
                  { value: 'cyan', label: '霓虹青' },
                  { value: 'purple', label: '赛博紫' },
                  { value: 'pink', label: '激光粉' },
                  { value: 'green', label: '矩阵绿' },
                ]}
              />

              <div className="flex gap-6">
                <CyberCheckbox
                  label="启用通知"
                  color="cyan"
                  defaultChecked
                />
                <CyberCheckbox
                  label="记住我"
                  color="purple"
                />
              </div>
            </div>
          </motion.section>

          {/* 全息投影卡片展示 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-glow-cyan">
              全息投影
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <HoloCard
                title="前端开发"
                description="使用 Next.js 14 和 TypeScript 构建现代化 Web 应用"
                icon={<Zap className="w-6 h-6 text-cyber-cyan" />}
                stats={[
                  { label: '项目', value: '50+' },
                  { label: '经验', value: '5年' },
                ]}
                actions={[
                  { label: '了解更多', onClick: () => console.log('了解更多') },
                ]}
              />

              <HoloCard
                title="UI 设计"
                description="赛博朋克风格的用户界面设计"
                icon={<Palette className="w-6 h-6 text-cyber-purple" />}
                stats={[
                  { label: '设计', value: '100+' },
                  { label: '满意', value: '98%' },
                ]}
              />

              <HoloCard
                title="安全防护"
                description="企业级安全解决方案"
                icon={<Shield className="w-6 h-6 text-cyber-pink" />}
                stats={[
                  { label: '保护', value: '24/7' },
                  { label: '安全', value: '100%' },
                ]}
              />
            </div>

            {/* 全息按钮 */}
            <div className="flex gap-4 mt-8 justify-center">
              <HoloButton variant="primary" onClick={() => console.log('Primary')}>
                主要按钮
              </HoloButton>
              <HoloButton variant="secondary" onClick={() => console.log('Secondary')}>
                次要按钮
              </HoloButton>
              <HoloButton variant="outline" onClick={() => console.log('Outline')}>
                轮廓按钮
              </HoloButton>
            </div>
          </motion.section>

          {/* 自定义全息投影示例 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-glow-purple">
              交互式全息卡片
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <HoloProjector intensity={7} glowColor="cyan" showGrid>
                <div className="p-8 text-center">
                  <Code className="w-16 h-16 text-cyber-cyan mx-auto mb-4" />
                  <h3 className="font-display font-bold text-2xl text-white mb-2">
                    代码示例
                  </h3>
                  <p className="text-gray-400 mb-4">
                    将鼠标悬停在卡片上查看 3D 倾斜效果
                  </p>
                  <div className="text-left bg-cyber-darker rounded p-4 font-mono text-sm text-cyber-cyan">
                    {`console.log('Hello CyberPress');`}
                  </div>
                </div>
              </HoloProjector>

              <HoloProjector intensity={7} glowColor="purple" showGrid>
                <div className="p-8 text-center">
                  <Zap className="w-16 h-16 text-cyber-purple mx-auto mb-4" />
                  <h3 className="font-display font-bold text-2xl text-white mb-2">
                    性能优化
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Framer Motion 驱动的流畅动画
                  </p>
                  <div className="flex justify-center gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-cyber-cyan">60</div>
                      <div className="text-xs text-gray-500">FPS</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-cyber-purple">100</div>
                      <div className="text-xs text-gray-500">评分</div>
                    </div>
                  </div>
                </div>
              </HoloProjector>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
