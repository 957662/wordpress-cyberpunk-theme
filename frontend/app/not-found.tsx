/**
 * 404 页面
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlitchText } from '@/components/effects/GlitchText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          {/* Glitch 404 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-[180px] md:text-[240px] leading-none">
              <GlitchText text="404" speed="fast" />
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              页面未找到
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              您访问的页面可能已被移除、重命名或暂时不可用。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/">
                <Button variant="primary" size="lg">
                  返回首页
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  浏览博客
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex justify-center gap-8"
          >
            <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-cyber-pink rounded-full animate-pulse delay-200" />
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
