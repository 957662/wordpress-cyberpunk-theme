/**
 * 图表组件示例页面
 */

'use client';

import React, { useState, useEffect } from 'react';
import { RealTimeChart, DataPoint } from '@/components/charts/RealTimeChart';

export default function ChartsExamplePage() {
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // 生成初始数据
    const initialData: DataPoint[] = Array.from({ length: 20 }, (_, i) => ({
      timestamp: Date.now() - (20 - i) * 1000,
      value: Math.random() * 100,
      label: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString()
    }));
    setChartData(initialData);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-cyber-cyan mb-2">
          实时图表
        </h1>
        <p className="text-cyber-muted">
          动态数据可视化组件
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 折线图 */}
        <RealTimeChart
          type="line"
          title="折线图"
          data={chartData}
          updateInterval={1000}
          showStats={true}
          color="#06b6d4"
          onDataUpdate={setChartData}
        />

        {/* 面积图 */}
        <RealTimeChart
          type="area"
          title="面积图"
          data={chartData}
          updateInterval={1000}
          showStats={true}
          color="#8b5cf6"
        />

        {/* 柱状图 */}
        <RealTimeChart
          type="bar"
          title="柱状图"
          data={chartData}
          updateInterval={1000}
          showStats={true}
          color="#ec4899"
        />

        {/* 自定义颜色 */}
        <RealTimeChart
          type="line"
          title="自定义主题"
          data={chartData}
          updateInterval={1000}
          showStats={true}
          showGrid={false}
          color="#f59e0b"
        />
      </div>
    </div>
  );
}
