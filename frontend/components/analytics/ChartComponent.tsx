'use client';

import { motion } from 'framer-motion';
import { CyberCard } from '@/components/cyber/CyberCard';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartComponentProps {
  data: ChartDataPoint[];
  title?: string;
  type?: 'line' | 'bar';
  color?: 'cyan' | 'purple' | 'pink';
}

export function ChartComponent({
  data,
  title,
  type = 'line',
  color = 'cyan',
}: ChartComponentProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  const colorMap = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
  };

  const colorClass = colorMap[color];

  return (
    <CyberCard className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      )}

      <div className="space-y-4">
        {data.map((point, index) => {
          const percentage = (point.value / maxValue) * 100;

          return (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{point.label}</span>
                <span className="text-white font-semibold">{point.value.toLocaleString()}</span>
              </div>
              <div className="relative h-2 bg-cyber-dark rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`absolute inset-y-0 left-0 ${colorClass} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </CyberCard>
  );
}
