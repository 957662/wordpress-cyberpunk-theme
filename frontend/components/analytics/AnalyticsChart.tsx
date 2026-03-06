/**
 * Analytics Chart Component
 *
 * Interactive data visualization component for analytics
 */

'use client';

import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Download, RefreshCw } from 'lucide-react';

export type ChartType = 'line' | 'area' | 'bar' | 'pie';

export interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartData {
  title: string;
  description?: string;
  data: DataPoint[];
  type?: ChartType;
  colorScheme?: string[];
  dataKey?: string;
  xAxisKey?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTrend?: boolean;
}

interface AnalyticsChartProps {
  chartData: ChartData;
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
  height?: number;
  className?: string;
}

const COLOR_SCHEMES = {
  default: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  pastel: ['#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#c4b5fd', '#f9a8d4'],
  vibrant: ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'],
  monochrome: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'],
};

const calculateTrend = (data: DataPoint[]): 'up' | 'down' | 'stable' => {
  if (data.length < 2) return 'stable';

  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));

  const firstAvg = firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length;

  const threshold = 0.05; // 5% threshold
  const ratio = secondAvg / firstAvg - 1;

  if (ratio > threshold) return 'up';
  if (ratio < -threshold) return 'down';
  return 'stable';
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    default:
      return <Minus className="w-4 h-4 text-gray-600" />;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  chartData,
  onRefresh,
  onExport,
  loading = false,
  height = 300,
  className = '',
}) => {
  const [chartType, setChartType] = React.useState<ChartType>(chartData.type || 'line');
  const [colorScheme, setColorScheme] = React.useState<string>('default');

  const trend = useMemo(() => calculateTrend(chartData.data), [chartData.data]);
  const colors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;

  const totalValue = useMemo(
    () => chartData.data.reduce((sum, point) => sum + point.value, 0),
    [chartData.data]
  );

  const averageValue = useMemo(
    () => totalValue / chartData.data.length,
    [totalValue, chartData.data.length]
  );

  const renderChart = () => {
    const commonProps = {
      data: chartData.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {chartData.showGrid !== false && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={chartData.xAxisKey || 'name'}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <RechartsTooltip content={<CustomTooltip />} />
            {chartData.showLegend !== false && <Legend />}
            <Line
              type="monotone"
              dataKey={chartData.dataKey || 'value'}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {chartData.showGrid !== false && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={chartData.xAxisKey || 'name'}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <RechartsTooltip content={<CustomTooltip />} />
            {chartData.showLegend !== false && <Legend />}
            <Area
              type="monotone"
              dataKey={chartData.dataKey || 'value'}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {chartData.showGrid !== false && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={chartData.xAxisKey || 'name'}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <RechartsTooltip content={<CustomTooltip />} />
            {chartData.showLegend !== false && <Legend />}
            <Bar
              dataKey={chartData.dataKey || 'value'}
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={chartData.dataKey || 'value'}
            >
              {chartData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            {chartData.showLegend !== false && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {chartData.title}
              {chartData.showTrend !== false && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="gap-1">
                        {getTrendIcon(trend)}
                        Trend
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {trend === 'up' && 'Values are increasing'}
                        {trend === 'down' && 'Values are decreasing'}
                        {trend === 'stable' && 'Values are stable'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            {chartData.description && (
              <CardDescription>{chartData.description}</CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Selector */}
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
              </SelectContent>
            </Select>

            {/* Color Scheme Selector */}
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Colors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="pastel">Pastel</SelectItem>
                <SelectItem value="vibrant">Vibrant</SelectItem>
                <SelectItem value="monochrome">Mono</SelectItem>
              </SelectContent>
            </Select>

            {/* Actions */}
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="icon" onClick={onExport}>
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-2xl font-bold">{averageValue.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data Points</p>
            <p className="text-2xl font-bold">{chartData.data.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {chartData.data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
