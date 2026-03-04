'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CyberToast, ToastContainer } from '@/components/ui/toast';
import { CyberTooltip } from '@/components/ui/tooltip';
import { CyberProgress, CircularProgress } from '@/components/ui/progress';
import { CyberSkeleton, CardSkeleton, ListSkeleton } from '@/components/ui/skeleton';
import { CyberAvatar, AvatarGroup } from '@/components/ui/avatar';
import { CyberBadge, StatusBadge, TagBadge } from '@/components/ui/badge';
import { CyberTabs } from '@/components/ui/tabs';
import { CyberAccordion } from '@/components/ui/accordion';
import { CyberCarousel } from '@/components/ui/carousel';
import { CyberRating, RatingDisplay } from '@/components/ui/rating';
import { CyberButton } from '@/components/cyber/CyberButton';
import { CyberCard } from '@/components/cyber/cyber-card';
import { useToast, useToggle, useCounter, useLocalStorage } from '@/lib/hooks';

export default function UIShowcasePage() {
  const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast();
  const [isToggled, toggle, setToggle] = useToggle(false);
  const { count, increment, decrement, reset } = useCounter(0);
  const [name, setName] = useLocalStorage('demo-name', '');
  const [rating, setRating] = useState(3.5);

  const carouselItems = [
    { id: '1', content: <div className="h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center"><span className="text-4xl font-bold text-cyan-400">Slide 1</span></div> },
    { id: '2', content: <div className="h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center"><span className="text-4xl font-bold text-purple-400">Slide 2</span></div> },
    { id: '3', content: <div className="h-64 bg-gradient-to-br from-pink-500/20 to-green-500/20 rounded-xl flex items-center justify-center"><span className="text-4xl font-bold text-pink-400">Slide 3</span></div> },
  ];

  const tabsData = [
    { id: 'tab1', label: 'Overview', content: <div className="p-4"><h3 className="text-xl font-bold mb-2">Overview</h3><p>Overview content here</p></div> },
    { id: 'tab2', label: 'Features', content: <div className="p-4"><h3 className="text-xl font-bold mb-2">Features</h3><p>Features content here</p></div> },
    { id: 'tab3', label: 'Settings', content: <div className="p-4"><h3 className="text-xl font-bold mb-2">Settings</h3><p>Settings content here</p></div> },
  ];

  const accordionData = [
    { id: 'item1', title: 'What is CyberPress?', content: 'CyberPress is a cyberpunk-style blog platform.' },
    { id: 'item2', title: 'Features', content: 'Real-time notifications, social interactions, and more.' },
    { id: 'item3', title: 'Technology', content: 'Built with Next.js, FastAPI, and TypeScript.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            UI Components Showcase
          </h1>
          <p className="text-gray-400 text-lg">Newly created CyberPress UI components</p>
        </motion.div>

        <CyberCard variant="neon" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Toast Notifications</h2>
          <div className="flex flex-wrap gap-3">
            <CyberButton color="cyan" onClick={() => showSuccess('Success!', 'Operation completed')}>Success</CyberButton>
            <CyberButton color="pink" onClick={() => showError('Error!', 'Something went wrong')}>Error</CyberButton>
            <CyberButton color="yellow" onClick={() => showWarning('Warning!', 'Please be careful')}>Warning</CyberButton>
            <CyberButton color="purple" onClick={() => showInfo('Info!', 'Information here')}>Info</CyberButton>
          </div>
        </CyberCard>

        <CyberCard variant="glass" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Tooltips</h2>
          <div className="flex flex-wrap gap-4">
            <CyberTooltip content="Cyan tooltip!" color="cyan" position="top"><CyberButton color="cyan">Top</CyberButton></CyberTooltip>
            <CyberTooltip content="Purple tooltip!" color="purple" position="bottom"><CyberButton color="purple">Bottom</CyberButton></CyberTooltip>
            <CyberTooltip content="Pink tooltip!" color="pink" position="left"><CyberButton color="pink">Left</CyberButton></CyberTooltip>
            <CyberTooltip content="Green tooltip!" color="green" position="right"><CyberButton color="green">Right</CyberButton></CyberTooltip>
          </div>
        </CyberCard>

        <CyberCard variant="holographic" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-pink-400 mb-4">Progress Bars</h2>
          <div className="space-y-6">
            <CyberProgress value={75} color="cyan" size="md" showLabel glow />
            <CyberProgress value={60} color="purple" size="lg" striped animated />
            <div className="flex items-center gap-8">
              <CircularProgress value={75} color="pink" size={120} />
              <CircularProgress value={90} color="green" size={100} />
            </div>
          </div>
        </CyberCard>

        <CyberCard variant="glass" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Avatars</h2>
          <div className="space-y-6">
            <div className="flex items-end gap-4">
              <CyberAvatar size="xs" fallback="XS" color="cyan" />
              <CyberAvatar size="sm" fallback="SM" color="purple" />
              <CyberAvatar size="md" fallback="MD" color="pink" />
              <CyberAvatar size="lg" fallback="LG" color="green" />
              <CyberAvatar size="xl" fallback="XL" color="yellow" />
            </div>
            <div className="flex items-center gap-4">
              <CyberAvatar size="lg" fallback="JD" color="cyan" status="online" />
              <CyberAvatar size="lg" fallback="AS" color="purple" status="busy" />
              <CyberAvatar size="lg" fallback="MK" color="pink" status="away" />
              <CyberAvatar size="lg" fallback="TB" color="green" status="offline" />
            </div>
          </div>
        </CyberCard>

        <CyberCard variant="neon" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Badges</h2>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <CyberBadge color="cyan" variant="solid">Solid</CyberBadge>
              <CyberBadge color="purple" variant="outline">Outline</CyberBadge>
              <CyberBadge color="pink" variant="glow">Glow</CyberBadge>
              <CyberBadge color="green" variant="neon">Neon</CyberBadge>
            </div>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="online" />
              <StatusBadge status="busy" />
              <StatusBadge status="away" />
              <StatusBadge status="offline" />
            </div>
          </div>
        </CyberCard>

        <CyberCard variant="glass" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Tabs</h2>
          <CyberTabs tabs={tabsData} color="cyan" variant="neon" size="md" />
        </CyberCard>

        <CyberCard variant="holographic" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Accordion</h2>
          <CyberAccordion items={accordionData} color="purple" allowMultiple glow />
        </CyberCard>

        <CyberCard variant="neon" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-pink-400 mb-4">Carousel</h2>
          <CyberCarousel items={carouselItems} color="pink" autoPlay showArrows showDots loop />
        </CyberCard>

        <CyberCard variant="glass" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Rating</h2>
          <div className="space-y-6">
            <CyberRating value={rating} onChange={setRating} color="yellow" size="lg" allowHalf showValue />
            <div className="flex flex-wrap gap-6 items-center">
              <RatingDisplay value={4.5} max={5} color="yellow" showValue showCount count={1234} />
              <RatingDisplay value={3.7} max={5} color="cyan" showValue />
            </div>
          </div>
        </CyberCard>

        <CyberCard variant="holographic" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Hooks Demo</h2>
          <div className="space-y-6">
            <div className="p-4 border border-white/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">useToggle</h3>
              <p className="text-gray-400 mb-3">State: {isToggled ? 'ON' : 'OFF'}</p>
              <div className="flex gap-3">
                <CyberButton color="cyan" onClick={toggle}>Toggle</CyberButton>
                <CyberButton color="purple" onClick={() => setToggle(true)}>ON</CyberButton>
                <CyberButton color="pink" onClick={() => setToggle(false)}>OFF</CyberButton>
              </div>
            </div>
            <div className="p-4 border border-white/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">useCounter</h3>
              <p className="text-gray-400 mb-3">Count: {count}</p>
              <div className="flex gap-3">
                <CyberButton color="green" onClick={decrement}>-</CyberButton>
                <CyberButton color="yellow" onClick={increment}>+</CyberButton>
                <CyberButton color="pink" onClick={reset}>Reset</CyberButton>
              </div>
            </div>
          </div>
        </CyberCard>

        <CyberCard variant="glass" className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Skeleton Loading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSkeleton color="cyan" showAvatar showImage lines={3} />
            <ListSkeleton items={3} color="purple" showAvatar />
          </div>
        </CyberCard>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} position="top-right" />
    </div>
  );
}
