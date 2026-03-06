/**
 * 开发者工具组件
 * 用于调试和开发
 */

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Code, X, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface DevToolsContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const DevToolsContext = React.createContext<DevToolsContextValue | undefined>(undefined);

export function DevToolsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = React.useMemo(() => ({ isOpen, toggle }), [isOpen, toggle]);

  return (
    <DevToolsContext.Provider value={value}>
      {children}
      <DevToolsPanel
        isOpen={isOpen}
        isMinimized={isMinimized}
        onClose={() => setIsOpen(false)}
        onToggleMinimize={() => setIsMinimized((prev) => !prev)}
      />
    </DevToolsContext.Provider>
  );
}

interface DevToolsPanelProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
}

function DevToolsPanel({
  isOpen,
  isMinimized,
  onClose,
  onToggleMinimize,
}: DevToolsPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'state' | 'props' | 'perf'>('state');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50',
          'bg-cyber-card border-l border-cyber-border',
          'shadow-neon-cyan/20',
          isMinimized ? 'w-16' : 'w-96'
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyber-cyan" />
            {!isMinimized && (
              <span className="font-semibold text-white">DevTools</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMinimize}
              className="p-1.5 rounded hover:bg-cyber-muted/50 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-gray-400" />
              ) : (
                <Minimize2 className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-cyber-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* 标签页 */}
            <div className="flex border-b border-cyber-border">
              {(['state', 'props', 'perf'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === tab
                      ? 'text-cyber-cyan border-b-2 border-cyber-cyan'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* 内容区域 */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              {activeTab === 'state' && <StateInspector />}
              {activeTab === 'props' && <PropsInspector />}
              {activeTab === 'perf' && <PerformanceMonitor />}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// 状态检查器
function StateInspector() {
  const [routes, setRoutes] = React.useState<any[]>([]);

  React.useEffect(() => {
    // 获取路由信息
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/api/dev/routes');
        if (response.ok) {
          const data = await response.json();
          setRoutes(data);
        }
      } catch (error) {
        console.error('Failed to fetch routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Application State</h3>
        <button
          onClick={() => window.location.reload()}
          className="p-1.5 rounded hover:bg-cyber-muted/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-cyber-cyan" />
        </button>
      </div>

      <div className="space-y-2">
        <InfoItem label="Environment" value={process.env.NODE_ENV} />
        <InfoItem label="Version" value="1.0.0" />
        <InfoItem label="Build Time" value={new Date().toLocaleString()} />
      </div>

      <div className="pt-4 border-t border-cyber-border">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Routes ({routes.length})</h4>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {routes.map((route: any, index: number) => (
            <div
              key={index}
              className="px-2 py-1 text-xs font-mono text-gray-300 bg-cyber-dark/50 rounded"
            >
              {route.path}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Props 检查器
function PropsInspector() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white">Component Props</h3>
      <p className="text-xs text-gray-400">
        点击页面上的组件查看其 props
      </p>
      <div className="p-4 bg-cyber-dark/50 border border-cyber-border rounded-lg">
        <p className="text-sm text-gray-300">Select a component to inspect</p>
      </div>
    </div>
  );
}

// 性能监控器
function PerformanceMonitor() {
  const [fps, setFps] = React.useState(60);
  const [memory, setMemory] = React.useState<any>(null);

  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFps = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFps);
    };

    requestAnimationFrame(measureFps);

    // 获取内存使用情况
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      setMemory({
        used: Math.round(mem.usedJSHeapSize / 1048576),
        total: Math.round(mem.totalJSHeapSize / 1048576),
        limit: Math.round(mem.jsHeapSizeLimit / 1048576),
      });
    }
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white">Performance</h3>

      <div className="space-y-3">
        <MetricCard
          label="FPS"
          value={fps}
          max={60}
          color={fps >= 50 ? 'green' : fps >= 30 ? 'yellow' : 'red'}
        />

        {memory && (
          <>
            <MetricCard
              label="Memory Used"
              value={`${memory.used} MB`}
              suffix={`/ ${memory.limit} MB`}
              color={memory.used / memory.limit < 0.8 ? 'green' : 'yellow'}
            />
            <MetricCard
              label="Memory Total"
              value={`${memory.total} MB`}
              color="cyan"
            />
          </>
        )}

        <div className="p-3 bg-cyber-dark/50 border border-cyber-border rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Page Load Time</div>
          <div className="text-lg font-mono text-white">
            {Math.round(performance.now())}ms
          </div>
        </div>
      </div>
    </div>
  );
}

// 信息项
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-mono text-cyber-cyan">{value}</span>
    </div>
  );
}

// 指标卡片
function MetricCard({
  label,
  value,
  max,
  suffix,
  color,
}: {
  label: string;
  value: number | string;
  max?: number;
  suffix?: string;
  color: 'green' | 'yellow' | 'red' | 'cyan';
}) {
  const colorMap = {
    green: 'text-cyber-green border-cyber-green',
    yellow: 'text-cyber-yellow border-cyber-yellow',
    red: 'text-cyber-pink border-cyber-pink',
    cyan: 'text-cyber-cyan border-cyber-cyan',
  };

  const percentage = max ? Math.min((Number(value) / max) * 100, 100) : 100;

  return (
    <div className="p-3 bg-cyber-dark/50 border border-cyber-border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={cn('text-sm font-mono', colorMap[color])}>
          {value}
          {suffix && <span className="text-gray-400 ml-1">{suffix}</span>}
        </span>
      </div>
      {max && (
        <div className="w-full bg-cyber-muted rounded-full h-1.5 overflow-hidden">
          <motion.div
            className={cn('h-full', colorMap[color].split(' ')[1])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </div>
  );
}

// 触发按钮
export function DevToolsTrigger() {
  const { toggle } = React.useContext(DevToolsContext)!;

  return (
    <button
      onClick={toggle}
      className={cn(
        'fixed bottom-4 right-4 z-40',
        'flex items-center gap-2 px-3 py-2',
        'bg-cyber-cyan/20 border border-cyber-cyan/50',
        'text-cyber-cyan text-sm font-medium rounded-lg',
        'hover:bg-cyber-cyan/30 hover:shadow-neon-cyan/50',
        'transition-all duration-200',
        'shadow-lg'
      )}
    >
      <Code className="w-4 h-4" />
      <span>DevTools</span>
    </button>
  );
}
