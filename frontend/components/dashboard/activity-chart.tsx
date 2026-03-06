/**
 * Activity Chart - 活动图表组件
 * 赛博朋克风格的活动趋势图表
 */

"use client";

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// ============================================
// 类型定义
// ============================================

export type ChartType = 'line' | 'area' | 'bar';

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface DataSeries {
  name: string;
  dataKey: string;
  color: string;
  strokeWidth?: number;
}

export interface ActivityChartProps {
  /** 图表数据 */
  data: ChartDataPoint[];
  /** 数据系列配置 */
  series: DataSeries[];
  /** 图表类型 */
  type?: ChartType;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: LucideIcon;
  /** 高度 */
  height?: number;
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 是否平滑曲线 */
  smooth?: boolean;
  /** 是否显示图例 */
  showLegend?: boolean;
  /** 是否显示参考线 */
  showReferenceLine?: boolean;
  /** 参考线值 */
  referenceLineValue?: number;
  /** 自定义类名 */
  className?: string;
  /** 颜色主题 */
  theme?: 'cyan' | 'purple' | 'pink' | 'green' | 'multi';
}

// ============================================
// 颜色主题配置
// ============================================

const themeColors = {
  cyan: {
    primary: '#00f0ff',
    secondary: 'rgba(0, 240, 255, 0.1)',
    stroke: '#00f0ff',
  },
  purple: {
    primary: '#9d00ff',
    secondary: 'rgba(157, 0, 255, 0.1)',
    stroke: '#9d00ff',
  },
  pink: {
    primary: '#ff0080',
    secondary: 'rgba(255, 0, 128, 0.1)',
    stroke: '#ff0080',
  },
  green: {
    primary: '#00ff88',
    secondary: 'rgba(0, 255, 136, 0.1)',
    stroke: '#00ff88',
  },
  multi: {
    primary: '#00f0ff',
    secondary: '#9d00ff',
    tertiary: '#ff0080',
  },
};

// ============================================
// 自定义 Tooltip 组件
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  theme?: string;
}

function CustomTooltip({ active, payload, label, theme = 'cyan' }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const colors = themeColors[theme as keyof typeof themeColors];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-2xl"
      style={{
        boxShadow: `0 0 20px ${colors.primary}40`,
      }}
    >
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white text-sm font-medium">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ============================================
// 自定义 Legend 组件
// ============================================

interface CustomLegendProps {
  payload?: any[];
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap gap-6 justify-center mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 图表容器组件
// ============================================

interface ChartContainerProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  showLegend?: boolean;
  legendContent?: React.ReactNode;
  className?: string;
}

function ChartContainer({
  title,
  description,
  icon: Icon,
  children,
  showLegend,
  legendContent,
  className = '',
}: ChartContainerProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-white/10
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-sm p-6
        ${className}
      `}
    >
      {/* 扫描线效果 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
        }}
      />

      {/* 头部 */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <div className="flex items-center gap-3 mb-2">
              {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
      )}

      {/* 图表内容 */}
      <div className="relative z-10">{children}</div>

      {/* 图例 */}
      {showLegend && legendContent && (
        <div className="mt-4">{legendContent}</div>
      )}

      {/* 发光边框效果 */}
      <div className="absolute inset-0 rounded-xl pointer-events-none border border-cyan-500/20" />

      {/* 装饰性发光点 */}
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-20 bg-cyan-500" />
      <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full blur-2xl opacity-20 bg-purple-500" />
    </div>
  );
}

// ============================================
// Activity Chart 组件
// ============================================

export function ActivityChart({
  data,
  series,
  type = 'area',
  title,
  description,
  icon,
  height = 300,
  showGrid = true,
  smooth = true,
  showLegend = true,
  showReferenceLine = false,
  referenceLineValue = 0,
  className = '',
  theme = 'cyan',
}: ActivityChartProps) {
  // 验证数据
  if (!data || data.length === 0) {
    return (
      <ChartContainer title={title} description={description} icon={icon} className={className}>
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-500">暂无数据</p>
        </div>
      </ChartContainer>
    );
  }

  const ChartComponent = type === 'bar' ? BarChart : type === 'line' ? LineChart : AreaChart;
  const DataComponent = type === 'bar' ? Bar : type === 'line' ? Line : Area;

  // 图例内容
  const legendContent = <CustomLegend payload={series.map(s => ({ color: s.color, value: s.name }))} />;

  return (
    <ChartContainer
      title={title}
      description={description}
      icon={icon}
      showLegend={showLegend}
      legendContent={legendContent}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
          )}

          <XAxis
            dataKey="name"
            stroke="#666"
            style={{ fontSize: '12px' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            stroke="#666"
            style={{ fontSize: '12px' }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip theme={theme} />} />

          {showLegend && <Legend content={<CustomLegend />} />}

          {showReferenceLine && (
            <ReferenceLine
              y={referenceLineValue}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeDasharray="3 3"
            />
          )}

          {series.map((s) => (
            <DataComponent
              key={s.dataKey}
              type={smooth && type !== 'bar' ? 'monotone' : 'linear'}
              dataKey={s.dataKey}
              stroke={s.color}
              strokeWidth={s.strokeWidth || 2}
              fill={type === 'area' ? s.color : undefined}
              fillOpacity={type === 'area' ? 0.3 : undefined}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ============================================
// 预设图表配置
// ============================================

export const chartPresets = {
  // 访问量图表
  views: {
    series: [
      { name: '页面浏览', dataKey: 'views', color: '#00f0ff', strokeWidth: 2 },
      { name: '独立访客', dataKey: 'visitors', color: '#9d00ff', strokeWidth: 2 },
    ],
  },

  // 用户增长图表
  users: {
    series: [
      { name: '新增用户', dataKey: 'new', color: '#00ff88', strokeWidth: 2 },
      { name: '活跃用户', dataKey: 'active', color: '#ff0080', strokeWidth: 2 },
    ],
  },

  // 文章统计图表
  posts: {
    series: [
      { name: '发布', dataKey: 'published', color: '#00f0ff', strokeWidth: 2 },
      { name: '草稿', dataKey: 'draft', color: '#f0ff00', strokeWidth: 2 },
    ],
  },

  // 收入图表
  revenue: {
    series: [
      { name: '收入', dataKey: 'revenue', color: '#00ff88', strokeWidth: 3 },
    ],
  },
};

// ============================================
// 使用示例
// ============================================

export function ActivityChartDemo() {
  // 示例数据
  const viewsData = [
    { name: '周一', views: 4200, visitors: 3200 },
    { name: '周二', views: 3800, visitors: 2800 },
    { name: '周三', views: 5200, visitors: 4100 },
    { name: '周四', views: 4800, visitors: 3600 },
    { name: '周五', views: 6100, visitors: 4800 },
    { name: '周六', views: 7500, visitors: 5900 },
    { name: '周日', views: 8200, visitors: 6400 },
  ];

  const usersData = [
    { name: '1月', new: 120, active: 890 },
    { name: '2月', new: 145, active: 1020 },
    { name: '3月', new: 180, active: 1150 },
    { name: '4月', new: 165, active: 1080 },
    { name: '5月', new: 210, active: 1320 },
    { name: '6月', new: 240, active: 1480 },
  ];

  const postsData = [
    { name: '周一', published: 8, draft: 12 },
    { name: '周二', published: 12, draft: 8 },
    { name: '周三', published: 6, draft: 15 },
    { name: '周四', published: 10, draft: 10 },
    { name: '周五', published: 15, draft: 6 },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">活动图表示例</h2>

      {/* 面积图 */}
      <ActivityChart
        title="网站访问趋势"
        description="过去7天的页面浏览量和独立访客数据"
        data={viewsData}
        series={chartPresets.views.series}
        type="area"
        theme="multi"
      />

      {/* 折线图 */}
      <ActivityChart
        title="用户增长趋势"
        description="过去6个月的新增和活跃用户数据"
        data={usersData}
        series={chartPresets.users.series}
        type="line"
        theme="green"
      />

      {/* 柱状图 */}
      <ActivityChart
        title="文章发布统计"
        description="本周文章发布和草稿数量"
        data={postsData}
        series={chartPresets.posts.series}
        type="bar"
        theme="cyan"
      />
    </div>
  );
}

export default ActivityChart;
