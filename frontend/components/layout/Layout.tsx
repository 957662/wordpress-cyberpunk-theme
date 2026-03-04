'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Progress } from '@/components/ui/Progress';
import { useReadingProgressStore } from '@/lib/store';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showProgress?: boolean;
}

export function Layout({ children, className, showProgress = true }: LayoutProps) {
  const { setProgress, resetProgress } = useReadingProgressStore();

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      resetProgress();
    };
  }, [setProgress, resetProgress]);

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col">
      {showProgress && <Progress />}
      <Header />
      <main className={cn('flex-1', className)}>{children}</main>
      <Footer />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url('/patterns/grid.svg')`,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url('/patterns/noise.svg')`,
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
