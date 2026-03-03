'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CyberButton from '@/components/cyber/cyber-button';
import CyberCard from '@/components/cyber/cyber-card';
import CyberInput from '@/components/cyber/cyber-input';
import { ParticleBackground } from '@/components/effects/particle-background';
import { CyberChart } from '@/components/data-viz/cyber-chart';
import CyberLoader from '@/components/loading/cyber-loader';
import { useCyberTypewriter, useCyberCounter, useCyberScroll } from '@/hooks/use-cyber-animations';
import { Search, Mail, Lock, User } from 'lucide-react';

export default function CyberComponentsPage() {
  const [loading, setLoading] = useState(false);
  const [chartData] = useState([10, 25, 40, 30, 55, 45, 60, 50, 75, 65, 80, 70]);
  const [chartLabels] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

  const { displayedText } = useCyberTypewriter('Welcome to the Cyberpunk Future', 100);
  const { count: visitorCount } = useCyberCounter(133742, 2000);
  const { isVisible: section1Visible, elementRef: section1Ref } = useCyberScroll(0.2);
  const { isVisible: section2Visible, elementRef: section2Ref } = useCyberScroll(0.2);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-cyber-dark overflow-hidden">
      {/* 粒子背景 */}
      <ParticleBackground particleCount={60} color="mixed" />

      {/* 主内容 */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 头部 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-4">
            {displayedText}
          </h1>
          <p className="text-xl text-cyber-cyan/80">
            Experience the Next Generation of UI Components
          </p>
          <motion.div
            className="mt-6 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <span className="text-cyber-pink font-mono">
              VISITORS: {visitorCount.toLocaleString()}
            </span>
          </motion.div>
        </motion.div>

        {/* 按钮展示 */}
        <motion.div
          ref={section1Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section1Visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <CyberCard variant="holographic" className="p-8">
            <h2 className="text-3xl font-bold text-cyber-cyan mb-6">Cyber Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <CyberButton variant="neon" size="sm">Neon Small</CyberButton>
              <CyberButton variant="neon" size="md">Neon Medium</CyberButton>
              <CyberButton variant="neon" size="lg" scanEffect>Neon Large</CyberButton>

              <CyberButton variant="glitch" size="sm">Glitch</CyberButton>
              <CyberButton variant="glitch" size="md">Glitch</CyberButton>

              <CyberButton variant="holographic" size="md">Holographic</CyberButton>

              <CyberButton variant="plasma" size="lg">Plasma</CyberButton>
            </div>
          </CyberCard>
        </motion.div>

        {/* 卡片展示 */}
        <motion.div
          ref={section2Ref}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={section2Visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-cyber-purple mb-6">Cyber Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CyberCard variant="glass" hover3D>
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">Glass Card</h3>
              <p className="text-gray-300">Beautiful glass morphism effect with backdrop blur.</p>
            </CyberCard>

            <CyberCard variant="neon" hover3D glowOnHover>
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">Neon Card</h3>
              <p className="text-gray-300">Glowing neon borders with cyber cyan accent.</p>
            </CyberCard>

            <CyberCard variant="holographic" hover3D scanlines>
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">Holographic Card</h3>
              <p className="text-gray-300">Gradient background with scanline effects.</p>
            </CyberCard>
          </div>
        </motion.div>

        {/* 输入框展示 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CyberCard variant="glass" className="p-8">
            <h2 className="text-3xl font-bold text-cyber-pink mb-6">Cyber Inputs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CyberInput
                label="Username"
                icon={<User size={20} />}
                variant="neon"
                placeholder="Enter your username"
              />

              <CyberInput
                label="Email"
                icon={<Mail size={20} />}
                variant="glass"
                placeholder="Enter your email"
              />

              <CyberInput
                label="Password"
                icon={<Lock size={20} />}
                variant="underline"
                type="password"
                showPasswordToggle
                placeholder="Enter your password"
              />

              <CyberInput
                label="Search"
                icon={<Search size={20} />}
                variant="neon"
                onIconClick={handleSearch}
                placeholder="Search the cyberverse"
              />
            </div>
          </CyberCard>
        </motion.div>

        {/* 图表展示 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CyberCard variant="holographic" className="p-8">
            <h2 className="text-3xl font-bold text-cyber-cyan mb-6">Cyber Charts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-cyber-purple mb-4">Line Chart</h3>
                <CyberChart
                  data={chartData}
                  labels={chartLabels}
                  type="line"
                  color="cyan"
                  height={250}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-cyber-pink mb-4">Area Chart</h3>
                <CyberChart
                  data={chartData}
                  labels={chartLabels}
                  type="area"
                  color="purple"
                  height={250}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-cyber-cyan mb-4">Bar Chart</h3>
                <CyberChart
                  data={chartData}
                  labels={chartLabels}
                  type="bar"
                  color="pink"
                  height={250}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-cyber-purple mb-4">Gradient Chart</h3>
                <CyberChart
                  data={chartData}
                  labels={chartLabels}
                  type="area"
                  color="gradient"
                  height={250}
                />
              </div>
            </div>
          </CyberCard>
        </motion.div>

        {/* 加载动画展示 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CyberCard variant="glass" className="p-8">
            <h2 className="text-3xl font-bold text-cyber-purple mb-6">Cyber Loaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              <div className="flex flex-col items-center gap-4">
                <CyberLoader variant="spinner" color="cyan" size="md" />
                <span className="text-sm text-cyber-cyan">Spinner</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <CyberLoader variant="dots" color="purple" size="md" />
                <span className="text-sm text-cyber-purple">Dots</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <CyberLoader variant="pulse" color="pink" size="md" />
                <span className="text-sm text-cyber-pink">Pulse</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <CyberLoader variant="scan" color="cyan" size="md" />
                <span className="text-sm text-cyber-cyan">Scan</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <CyberLoader variant="matrix" color="purple" size="md" />
                <span className="text-sm text-cyber-purple">Matrix</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <CyberLoader variant="spinner" color="rainbow" size="md" />
                <span className="text-sm text-cyber-pink">Rainbow</span>
              </div>
            </div>

            <div className="mt-8">
              <CyberLoader
                variant="scan"
                color="cyan"
                text="Loading cyber components..."
                progress={75}
              />
            </div>
          </CyberCard>
        </motion.div>

        {/* 调用行动 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CyberCard variant="neon" className="p-12 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-4">
              Ready to Build?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start creating amazing cyberpunk experiences today
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CyberButton variant="neon" size="lg" scanEffect>
                Get Started
              </CyberButton>
              <CyberButton variant="holographic" size="lg">
                View Docs
              </CyberButton>
            </div>
          </CyberCard>
        </motion.div>
      </div>

      {/* 全屏加载器 */}
      {loading && (
        <CyberLoader
          variant="matrix"
          color="cyan"
          text="Searching the cyberverse..."
          fullscreen
        />
      )}
    </div>
  );
}
