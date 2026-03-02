'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TechItem {
  name: string;
  icon: LucideIcon;
  level: number;
}

interface TechStackProps {
  items: TechItem[];
  className?: string;
}

export default function TechStack({ items, className = '' }: TechStackProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          className="relative p-4 rounded-lg border border-cyber-cyan/20 bg-cyber-darker/50 hover:border-cyber-cyan/50 transition-all"
        >
          {/* Background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center gap-3 mb-3">
            <div className="p-2 rounded bg-cyber-cyan/10">
              <item.icon className="w-5 h-5 text-cyber-cyan" />
            </div>
            <span className="font-medium text-white">{item.name}</span>
          </div>

          {/* Skill level bar */}
          <div className="relative">
            <div className="h-1.5 bg-cyber-darker rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
              />
            </div>
            <span className="text-xs text-gray-500 mt-1 block">{item.level}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
