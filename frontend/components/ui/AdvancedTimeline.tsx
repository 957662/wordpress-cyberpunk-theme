'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  time?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info' | 'default';
  trend?: 'up' | 'down' | 'neutral';
  details?: Record<string, string | number>;
  onClick?: () => void;
}

export interface TimelineProps {
  items: TimelineItem[];
  layout?: 'vertical' | 'horizontal';
  variant?: 'default' | 'alternate' | 'compact';
  showIcon?: boolean;
  showDate?: boolean;
  showTrend?: boolean;
  className?: string;
  onItemClick?: (item: TimelineItem) => void;
}

const statusColors = {
  success: 'bg-green-500 text-green-500 shadow-green-500/50',
  warning: 'bg-yellow-500 text-yellow-500 shadow-yellow-500/50',
  error: 'bg-red-500 text-red-500 shadow-red-500/50',
  info: 'bg-cyan-500 text-cyan-500 shadow-cyan-500/50',
  default: 'bg-gray-500 text-gray-500 shadow-gray-500/50'
};

const statusBorderColors = {
  success: 'border-green-500/30',
  warning: 'border-yellow-500/30',
  error: 'border-red-500/30',
  info: 'border-cyan-500/30',
  default: 'border-gray-500/30'
};

export function AdvancedTimeline({
  items,
  layout = 'vertical',
  variant = 'default',
  showIcon = true,
  showDate = true,
  showTrend = false,
  className,
  onItemClick
}: TimelineProps) {
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isAlternate = variant === 'alternate';
  const isCompact = variant === 'compact';
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={cn('relative', className)}>
      {/* 时间轴线 */}
      <div
        className={cn(
          'absolute bg-gradient-to-b from-cyan-500 to-purple-500',
          isHorizontal ? 'h-0.5 left-0 right-0 top-1/2 -translate-y-1/2' : 'w-0.5 top-0 bottom-0 left-4'
        )}
      />

      {/* 时间轴项 */}
      <div
        className={cn(
          'relative',
          isHorizontal ? 'flex items-center gap-8 overflow-x-auto pb-4' : 'space-y-6'
        )}
      >
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const shouldAlignRight = isAlternate && !isEven;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isHorizontal ? -20 : shouldAlignRight ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative',
                isHorizontal ? 'flex-shrink-0' : '',
                isAlternate && !isCompact ? 'flex' : '',
                isCompact ? 'ml-12' : ''
              )}
            >
              {/* 时间点 */}
              <div
                className={cn(
                  'absolute z-10 w-4 h-4 rounded-full border-4 border-gray-900 shadow-lg',
                  statusColors[item.status || 'default'],
                  isHorizontal ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'left-4 top-1',
                  !isCompact && 'top-6'
                )}
              >
                {item.icon && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                    {item.icon}
                  </div>
                )}
              </div>

              {/* 内容卡片 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  item.onClick?.();
                  onItemClick?.(item);
                }}
                className={cn(
                  'relative p-4 bg-gray-900/50 border-2 rounded-lg backdrop-blur-sm transition-all duration-200 cursor-pointer',
                  statusBorderColors[item.status || 'default'],
                  isHorizontal
                    ? 'w-64 ml-8'
                    : isCompact
                    ? 'ml-8'
                    : shouldAlignRight
                    ? 'ml-16 flex-1'
                    : 'ml-16'
                )}
              >
                {/* 趋势指示 */}
                {showTrend && item.trend && (
                  <div className="absolute top-4 right-4">
                    {item.trend === 'up' && <TrendingUp className="text-green-500" size={16} />}
                    {item.trend === 'down' && <TrendingDown className="text-red-500" size={16} />}
                    {item.trend === 'neutral' && <Minus className="text-gray-500" size={16} />}
                  </div>
                )}

                {/* 标题 */}
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>

                {/* 描述 */}
                {item.description && (
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                )}

                {/* 日期时间 */}
                {showDate && (
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    {item.time && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{item.time}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 详细信息 */}
                {item.details && Object.keys(item.details).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-800 space-y-1">
                    {Object.entries(item.details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{key}</span>
                        <span className="text-cyan-400 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 箭头 */}
                <div
                  className={cn(
                    'absolute text-cyan-500',
                    isHorizontal ? '-right-8 top-1/2 -translate-y-1/2' : 'right-4 top-1/2 -translate-y-1/2'
                  )}
                >
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 时间轴统计组件
export interface TimelineStatsProps {
  totalItems: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  className?: string;
}

export function TimelineStats({
  totalItems,
  successCount,
  warningCount,
  errorCount,
  className
}: TimelineStatsProps) {
  const stats = [
    { label: '总计', value: totalItems, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
    { label: '成功', value: successCount, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { label: '警告', value: warningCount, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { label: '错误', value: errorCount, color: 'text-red-400', bgColor: 'bg-red-500/20' }
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className={cn('text-sm', stat.color)}>{stat.label}</div>
          <div className="mt-2 h-1 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', stat.bgColor)}
              style={{ width: `${(stat.value / totalItems) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// 时间轴过滤器组件
export interface TimelineFilterProps {
  items: TimelineItem[];
  onFilterChange?: (filteredItems: TimelineItem[]) => void;
  className?: string;
}

export function TimelineFilter({ items, onFilterChange, className }: TimelineFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const statuses = [
    { value: 'all', label: '全部', color: 'bg-gray-500' },
    { value: 'success', label: '成功', color: 'bg-green-500' },
    { value: 'warning', label: '警告', color: 'bg-yellow-500' },
    { value: 'error', label: '错误', color: 'bg-red-500' },
    { value: 'info', label: '信息', color: 'bg-cyan-500' }
  ];

  useEffect(() => {
    let filtered = items;

    // 按状态过滤
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // 按日期范围过滤
    if (dateRange.from) {
      filtered = filtered.filter(item => new Date(item.date) >= dateRange.from!);
    }
    if (dateRange.to) {
      filtered = filtered.filter(item => new Date(item.date) <= dateRange.to!);
    }

    onFilterChange?.(filtered);
  }, [selectedStatus, dateRange, items, onFilterChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 状态过滤器 */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <motion.button
            key={status.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStatus(status.value)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              selectedStatus === status.value
                ? `${status.color} text-white`
                : 'bg-gray-800 text-gray-400 hover:text-white'
            )}
          >
            {status.label}
          </motion.button>
        ))}
      </div>

      {/* 日期范围选择器 */}
      <div className="flex items-center gap-4">
        <input
          type="date"
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))
          }
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        />
        <span className="text-gray-500">至</span>
        <input
          type="date"
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))
          }
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        />
      </div>
    </div>
  );
}
