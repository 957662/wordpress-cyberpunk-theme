'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Zap, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpeedTestProps {
  title?: string;
  showHistory?: boolean;
  maxHistory?: number;
  className?: string;
}

interface TestResult {
  id: string;
  timestamp: number;
  download: number;
  upload: number;
  latency: number;
  jitter: number;
}

const SpeedTest: React.FC<SpeedTestProps> = ({
  title = '网络测速',
  showHistory = true,
  maxHistory = 10,
  className,
}) => {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'download' | 'upload' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState({
    download: 0,
    upload: 0,
    latency: 0,
    jitter: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const formatSpeed = (Mbps: number): string => {
    if (Mbps < 1) {
      return `${(Mbps * 1000).toFixed(1)} Kbps`;
    }
    return `${Mbps.toFixed(2)} Mbps`;
  };

  const testLatency = async (): Promise<{ latency: number; jitter: number }> => {
    const latencies: number[] = [];

    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      try {
        await fetch(window.location.href, {
          method: 'HEAD',
          cache: 'no-store',
          signal: abortControllerRef.current?.signal,
        });
        const end = performance.now();
        latencies.push(end - start);
      } catch (error) {
        // Ignore abort errors
        if ((error as Error).name !== 'AbortError') {
          console.error('Latency test failed:', error);
        }
      }
    }

    if (latencies.length === 0) {
      return { latency: 0, jitter: 0 };
    }

    const latency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
    const jitter =
      latencies.reduce((sum, l) => sum + Math.abs(l - latency), 0) / latencies.length;

    return { latency, jitter };
  };

  const testDownload = async (): Promise<number> => {
    const fileSizes = [100, 500, 1000]; // KB
    const speeds: number[] = [];

    for (const size of fileSizes) {
      // 创建测试数据
      const data = new Array(size * 1024).fill('x').join('');
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const start = performance.now();
      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });
        await response.blob();
        const end = performance.now();

        const duration = (end - start) / 1000; // 秒
        const speedMbps = (size * 8) / duration / 1000;
        speeds.push(speedMbps);

        setProgress((prev) => prev + 100 / fileSizes.length / 3);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Download test failed:', error);
        }
      }

      URL.revokeObjectURL(url);
    }

    return speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
  };

  const testUpload = async (): Promise<number> => {
    const fileSizes = [100, 500, 1000]; // KB
    const speeds: number[] = [];

    for (const size of fileSizes) {
      const data = new Array(size * 1024).fill('x').join('');

      const start = performance.now();
      try {
        // 模拟上传（实际项目中需要真实的服务器端点）
        await new Promise((resolve) => setTimeout(resolve, (size * 8) / 10));
        const end = performance.now();

        const duration = (end - start) / 1000;
        const speedMbps = (size * 8) / duration / 1000;
        speeds.push(speedMbps);

        setProgress((prev) => prev + 100 / fileSizes.length / 3);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Upload test failed:', error);
        }
      }
    }

    return speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
  };

  const startTest = useCallback(async () => {
    if (testing) {
      // 停止测试
      abortControllerRef.current?.abort();
      setTesting(false);
      setPhase('idle');
      setProgress(0);
      return;
    }

    setTesting(true);
    setPhase('download');
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      // 测试延迟
      const { latency, jitter } = await testLatency();
      setCurrentTest((prev) => ({ ...prev, latency, jitter }));

      // 测试下载
      setPhase('download');
      const download = await testDownload();
      setCurrentTest((prev) => ({ ...prev, download }));

      // 测试上传
      setPhase('upload');
      const upload = await testUpload();
      setCurrentTest((prev) => ({ ...prev, upload }));

      setPhase('complete');

      // 保存结果
      const result: TestResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        download,
        upload,
        latency,
        jitter,
      };

      setResults((prev) => [result, ...prev].slice(0, maxHistory));
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setTesting(false);
      setTimeout(() => setPhase('idle'), 2000);
    }
  }, [testing, maxHistory]);

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm',
        className
      )}
    >
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {testing && (
            <button
              onClick={startTest}
              className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1 text-sm text-red-400 hover:bg-red-500/30"
            >
              <X className="h-4 w-4" />
              取消
            </button>
          )}
        </div>
      )}

      {/* 测试按钮 */}
      <motion.button
        onClick={startTest}
        disabled={testing}
        whileHover={{ scale: testing ? 1 : 1.02 }}
        whileTap={{ scale: testing ? 1 : 0.98 }}
        className={cn(
          'mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r p-6 font-semibold text-white transition-all',
          testing
            ? 'from-gray-600 to-gray-700 cursor-not-allowed'
            : 'from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30'
        )}
      >
        {testing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <ArrowUpDown className="h-6 w-6" />
            </motion.div>
            {phase === 'download' && '测试下载速度...'}
            {phase === 'upload' && '测试上传速度...'}
            {phase === 'complete' && '测试完成!'}
          </>
        ) : (
          <>
            <Zap className="h-6 w-6" />
            开始测速
          </>
        )}
      </motion.button>

      {/* 进度条 */}
      {testing && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {phase === 'download' ? '下载测试' : '上传测试'}
            </span>
            <span className="font-mono text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* 结果显示 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 下载速度 */}
        <div className="rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <ArrowUpDown className="h-4 w-4 rotate-180" />
            下载速度
          </div>
          <div className="text-2xl font-bold text-white">
            {testing && phase === 'download' ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                测试中...
              </motion.span>
            ) : (
              <span className="font-mono">
                {formatSpeed(currentTest.download)}
              </span>
            )}
          </div>
        </div>

        {/* 上传速度 */}
        <div className="rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <ArrowUpDown className="h-4 w-4" />
            上传速度
          </div>
          <div className="text-2xl font-bold text-white">
            {testing && phase === 'upload' ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                测试中...
              </motion.span>
            ) : (
              <span className="font-mono">{formatSpeed(currentTest.upload)}</span>
            )}
          </div>
        </div>

        {/* 延迟 */}
        <div className="rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 text-sm text-gray-400">延迟 (Ping)</div>
          <div className="text-2xl font-bold text-white">
            <span className="font-mono">
              {currentTest.latency.toFixed(0)} ms
            </span>
          </div>
        </div>

        {/* 抖动 */}
        <div className="rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 text-sm text-gray-400">抖动 (Jitter)</div>
          <div className="text-2xl font-bold text-white">
            <span className="font-mono">
              {currentTest.jitter.toFixed(1)} ms
            </span>
          </div>
        </div>
      </div>

      {/* 历史记录 */}
      {showHistory && results.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-gray-400">测试历史</h4>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between rounded-lg bg-gray-800/30 px-4 py-2"
              >
                <div className="text-xs text-gray-400">
                  {new Date(result.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-mono text-cyan-400">
                    ↓{formatSpeed(result.download)}
                  </span>
                  <span className="font-mono text-purple-400">
                    ↑{formatSpeed(result.upload)}
                  </span>
                  <span className="font-mono text-gray-400">
                    {result.latency.toFixed(0)}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedTest;
