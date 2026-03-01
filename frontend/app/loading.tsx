/**
 * 全局加载页面
 */

'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/icons';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="mb-8"
        >
          <Logo className="w-24 h-24 text-cyber-cyan mx-auto" />
        </motion.div>

        {/* Loading Text */}
        <h1 className="font-display font-bold text-2xl mb-4">
          <span className="text-glow-cyan text-cyber-cyan">CYBER</span>
          <span className="text-glow-purple text-cyber-purple">PRESS</span>
        </h1>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-cyber-muted rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyber-cyan rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
