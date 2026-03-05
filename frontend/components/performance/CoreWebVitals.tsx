'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CoreWebVitalsProps {
  className?: string;
  showThreshold?: boolean;
}

interface VitalScore {
  value: number;
  status: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
}

export function CoreWebVitals({ className, showThreshold = false }: CoreWebVitalsProps) {
  const [vitals, setVitals] = useState<{
    LCP: VitalScore | null;
    FID: VitalScore | null;
    CLS: VitalScore | null;
    FCP: VitalScore | null;
    TTFB: VitalScore | null;
  }>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Import web-vitals dynamically
    import('web-vitals').then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
      onCLS((metric) => {
        setVitals((prev) => ({
          ...prev,
          CLS: {
            value: metric.value,
            status: getMetricStatus(metric.value, 'CLS'),
            threshold: { good: 0.1, poor: 0.25 },
          },
        }));
      });

      onFID((metric) => {
        setVitals((prev) => ({
          ...prev,
          FID: {
            value: metric.value,
            status: getMetricStatus(metric.value, 'FID'),
            threshold: { good: 100, poor: 300 },
          },
        }));
      });

      onLCP((metric) => {
        setVitals((prev) => ({
          ...prev,
          LCP: {
            value: metric.value,
            status: getMetricStatus(metric.value, 'LCP'),
            threshold: { good: 2500, poor: 4000 },
          },
        }));
      });

      onFCP((metric) => {
        setVitals((prev) => ({
          ...prev,
          FCP: {
            value: metric.value,
            status: getMetricStatus(metric.value, 'FCP'),
            threshold: { good: 1800, poor: 3000 },
          },
        }));
      });

      onTTFB((metric) => {
        setVitals((prev) => ({
          ...prev,
          TTFB: {
            value: metric.value,
            status: getMetricStatus(metric.value, 'TTFB'),
            threshold: { good: 800, poor: 1800 },
          },
        }));
      });
    });
  }, []);

  const getMetricStatus = (value: number, metric: string): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      LCP: { good: 2500, poor: 4000 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'needs-improvement':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'poor':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return '✓';
      case 'needs-improvement':
        return '⚠';
      case 'poor':
        return '✗';
      default:
        return '○';
    }
  };

  const allLoaded = vitals.LCP && vitals.FID && vitals.CLS;

  return (
    <div className={cn('relative', className)}>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className={cn(
          'fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg border font-mono text-xs transition-all',
          allLoaded
            ? 'bg-cyber-dark/90 backdrop-blur-sm border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]'
            : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 animate-pulse'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {allLoaded ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Core Web Vitals
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <motion.span
              className="w-2 h-2 rounded-full bg-yellow-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Loading metrics...
          </span>
        )}
      </motion.button>

      {/* Metrics panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-16 right-4 z-50 w-80 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-cyber-cyan font-mono">Core Web Vitals</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-cyber-cyan/20 rounded transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {/* LCP */}
            <VitalCard
              name="LCP"
              description="Largest Contentful Paint"
              vital={vitals.LCP}
              unit="ms"
              showThreshold={showThreshold}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />

            {/* FID */}
            <VitalCard
              name="FID"
              description="First Input Delay"
              vital={vitals.FID}
              unit="ms"
              showThreshold={showThreshold}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />

            {/* CLS */}
            <VitalCard
              name="CLS"
              description="Cumulative Layout Shift"
              vital={vitals.CLS}
              unit=""
              showThreshold={showThreshold}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />

            {/* FCP */}
            <VitalCard
              name="FCP"
              description="First Contentful Paint"
              vital={vitals.FCP}
              unit="ms"
              showThreshold={showThreshold}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />

            {/* TTFB */}
            <VitalCard
              name="TTFB"
              description="Time to First Byte"
              vital={vitals.TTFB}
              unit="ms"
              showThreshold={showThreshold}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>

          {/* Overall status */}
          {allLoaded && (
            <div className="mt-4 pt-4 border-t border-cyber-cyan/20">
              <div className="text-xs text-gray-400 text-center">
                Overall Status:{' '}
                <span
                  className={cn(
                    'font-bold ml-1',
                    vitals.LCP?.status === 'good' &&
                    vitals.FID?.status === 'good' &&
                    vitals.CLS?.status === 'good'
                      ? 'text-green-400'
                      : 'text-yellow-400'
                  )}
                >
                  {vitals.LCP?.status === 'good' &&
                  vitals.FID?.status === 'good' &&
                  vitals.CLS?.status === 'good'
                    ? 'Good'
                    : 'Needs Improvement'}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

interface VitalCardProps {
  name: string;
  description: string;
  vital: VitalScore | null;
  unit: string;
  showThreshold: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
}

function VitalCard({
  name,
  description,
  vital,
  unit,
  showThreshold,
  getStatusColor,
  getStatusIcon,
}: VitalCardProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-all',
        vital ? getStatusColor(vital.status) : 'bg-gray-400/10 border-gray-400/30'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {vital && (
            <span className="text-lg font-bold">{getStatusIcon(vital.status)}</span>
          )}
          <div>
            <div className="text-xs font-bold">{name}</div>
            <div className="text-[10px] opacity-70">{description}</div>
          </div>
        </div>
        {vital ? (
          <div className="text-lg font-bold font-mono">
            {unit === '' ? vital.value.toFixed(3) : Math.round(vital.value)}
            {unit}
          </div>
        ) : (
          <div className="text-sm opacity-50">...</div>
        )}
      </div>
      {showThreshold && vital && (
        <div className="text-[10px] opacity-70 font-mono mt-1">
          Good: &lt;{vital.threshold.good}
          {unit} | Poor: &gt;{vital.poor}
          {unit}
        </div>
      )}
    </div>
  );
}
