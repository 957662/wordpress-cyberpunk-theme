'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

// ============================================
// 类型定义
// ============================================

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartConfig {
  data: ChartData[];
  title?: string;
  description?: string;
  color?: string;
  bgColor?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
}

// ============================================
// 颜色配置
// ============================================

const CYBER_COLORS = [
  '#00f0ff', // 霓虹青
  '#9d00ff', // 赛博紫
  '#ff0080', // 激光粉
  '#00ff88', // 赛博绿
  '#f0ff00', // 电压黄
  '#ff6b35', // 橙色
  '#0080ff', // 蓝色
  '#ff003c', // 红色
];

// ============================================
// 线图组件
// ============================================

interface LineChartProps extends ChartConfig {
  dataKey: string;
  strokeColor?: string;
  fillArea?: boolean;
  smooth?: boolean;
}

export const AnalyticsLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  description,
  dataKey,
  strokeColor = '#00f0ff',
  fillArea = false,
  smooth = true,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  height = 300,
}) => {
  const ChartComponent = fillArea ? AreaChart : LineChart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6"
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-bold text-cyber-white mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-cyber-gray">{description}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#3a3a4e"
              strokeOpacity={0.3}
            />
          )}
          <XAxis
            dataKey="name"
            stroke="#b0b0b0"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#b0b0b0"
            style={{ fontSize: '12px' }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #3a3a4e',
                borderRadius: '8px',
                color: '#00f0ff',
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{ color: '#b0b0b0' }}
            />
          )}
          {fillArea ? (
            <Area
              type={smooth ? 'monotone' : 'linear'}
              dataKey={dataKey}
              stroke={strokeColor}
              fill={strokeColor}
              fillOpacity={0.3}
            />
          ) : (
            <Line
              type={smooth ? 'monotone' : 'linear'}
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              dot={{ fill: strokeColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================
// 柱状图组件
// ============================================

interface BarChartProps extends ChartConfig {
  dataKey: string;
  horizontal?: boolean;
}

export const AnalyticsBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  description,
  dataKey,
  horizontal = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  height = 300,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6"
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-bold text-cyber-white mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-cyber-gray">{description}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={horizontal ? 'horizontal' : 'vertical'}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#3a3a4e"
              strokeOpacity={0.3}
            />
          )}
          <XAxis
            dataKey={horizontal ? 'value' : 'name'}
            stroke="#b0b0b0"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            type={horizontal ? 'category' : 'number'}
            dataKey={horizontal ? 'name' : 'value'}
            stroke="#b0b0b0"
            style={{ fontSize: '12px' }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #3a3a4e',
                borderRadius: '8px',
                color: '#00f0ff',
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{ color: '#b0b0b0' }}
            />
          )}
          <Bar
            dataKey={dataKey}
            fill="#00f0ff"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================
// 饼图组件
// ============================================

interface PieChartProps extends ChartConfig {
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

export const AnalyticsPieChart: React.FC<PieChartProps> = ({
  data,
  title,
  description,
  innerRadius = 0,
  outerRadius = 100,
  showLabels = true,
  showLegend = true,
  showTooltip = true,
  height = 300,
}) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (!showLabels) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="cyber-card p-6"
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-bold text-cyber-white mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-cyber-gray">{description}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CYBER_COLORS[index % CYBER_COLORS.length]}
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #3a3a4e',
                borderRadius: '8px',
                color: '#00f0ff',
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{ color: '#b0b0b0' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// ============================================
// 仪表板统计卡片
// ============================================

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon,
  color = '#00f0ff',
}) => {
  const isPositive = changeType === 'increase';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="cyber-card p-6 relative overflow-hidden"
    >
      {/* 背景装饰 */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-cyber-gray mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-cyber-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
          </div>
          {icon && (
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: `${color}20`,
                color,
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-cyber-green' : 'text-cyber-pink'
              }`}
            >
              {isPositive ? '+' : '-'}{Math.abs(change)}%
            </span>
            <span className="text-xs text-cyber-gray">vs 上月</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// 预制的仪表板数据
// ============================================

export const MOCK_CHART_DATA = {
  // 访问量数据
  visits: [
    { name: '周一', value: 4000 },
    { name: '周二', value: 3000 },
    { name: '周三', value: 5000 },
    { name: '周四', value: 2780 },
    { name: '周五', value: 5890 },
    { name: '周六', value: 6390 },
    { name: '周日', value: 5490 },
  ],

  // 用户增长数据
  users: [
    { name: '1月', value: 400 },
    { name: '2月', value: 300 },
    { name: '3月', value: 600 },
    { name: '4月', value: 800 },
    { name: '5月', value: 810 },
    { name: '6月', value: 950 },
  ],

  // 文章分类数据
  categories: [
    { name: '技术', value: 400 },
    { name: '生活', value: 300 },
    { name: '作品', value: 300 },
    { name: '随笔', value: 200 },
  ],

  // 来源数据
  sources: [
    { name: '直接访问', value: 4000 },
    { name: '搜索引擎', value: 3000 },
    { name: '社交媒体', value: 2000 },
    { name: '外部链接', value: 1500 },
    { name: '其他', value: 1000 },
  ],
};

export default AnalyticsLineChart;
