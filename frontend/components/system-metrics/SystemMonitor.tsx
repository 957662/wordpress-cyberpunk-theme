/**
 * System Monitor Component
 *
 * Real-time system monitoring dashboard showing CPU, memory, and disk usage
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Cpu, HardDrive, MemoryStick, RefreshCw, AlertTriangle } from 'lucide-react';

interface CPUInfo {
  percent: number;
  count_physical: number;
  count_logical: number;
  freq_current: number;
  freq_max: number;
  freq_min: number;
}

interface MemoryInfo {
  total: number;
  available: number;
  used: number;
  free: number;
  percent: number;
}

interface DiskInfo {
  total: number;
  used: number;
  free: number;
  percent: number;
  mountpoint: string;
}

interface SystemStatus {
  timestamp: string;
  uptime: number;
  cpu: CPUInfo;
  memory: MemoryInfo;
  disk: DiskInfo[];
  load_average?: number[];
}

const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const getStatusColor = (percent: number): string => {
  if (percent < 50) return 'bg-green-500';
  if (percent < 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getStatusBadge = (percent: number) => {
  if (percent < 50) return <Badge variant="default" className="bg-green-500">Good</Badge>;
  if (percent < 80) return <Badge variant="secondary" className="bg-yellow-500">Warning</Badge>;
  return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Critical</Badge>;
};

export const SystemMonitor: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/system/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }

      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchSystemStatus, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  if (loading && !systemStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !systemStatus) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p>{error}</p>
            <Button onClick={fetchSystemStatus} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!systemStatus) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Monitor</h2>
          <p className="text-muted-foreground">
            Real-time system performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Pause' : 'Resume'} Auto-Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSystemStatus}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* CPU Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.cpu.percent.toFixed(1)}%</div>
            <Progress
              value={systemStatus.cpu.percent}
              className="mt-2"
              indicatorClassName={getStatusColor(systemStatus.cpu.percent)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {systemStatus.cpu.count_physical} cores / {systemStatus.cpu.count_logical} threads
            </p>
          </CardContent>
        </Card>

        {/* Memory Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.memory.percent.toFixed(1)}%</div>
            <Progress
              value={systemStatus.memory.percent}
              className="mt-2"
              indicatorClassName={getStatusColor(systemStatus.memory.percent)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {formatBytes(systemStatus.memory.used)} / {formatBytes(systemStatus.memory.total)}
            </p>
          </CardContent>
        </Card>

        {/* Uptime Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(systemStatus.uptime)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Since last restart
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="cpu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cpu">CPU Details</TabsTrigger>
          <TabsTrigger value="memory">Memory Details</TabsTrigger>
          <TabsTrigger value="disk">Disk Usage</TabsTrigger>
        </TabsList>

        {/* CPU Tab */}
        <TabsContent value="cpu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CPU Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="text-2xl font-bold">{systemStatus.cpu.percent.toFixed(2)}%</p>
                  {getStatusBadge(systemStatus.cpu.percent)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="text-2xl font-bold">{systemStatus.cpu.freq_current.toFixed(0)} MHz</p>
                  <p className="text-xs text-muted-foreground">
                    Min: {systemStatus.cpu.freq_min} MHz / Max: {systemStatus.cpu.freq_max} MHz
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Physical Cores</p>
                  <p className="text-2xl font-bold">{systemStatus.cpu.count_physical}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logical Threads</p>
                  <p className="text-2xl font-bold">{systemStatus.cpu.count_logical}</p>
                </div>
              </div>

              {systemStatus.load_average && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Load Average</p>
                  <div className="flex gap-2">
                    {systemStatus.load_average.map((load, i) => (
                      <Badge key={i} variant="outline">
                        {i + 1} min: {load.toFixed(2)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Total Memory</span>
                  <span className="font-bold">{formatBytes(systemStatus.memory.total)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Used Memory</span>
                  <span className="font-bold">{formatBytes(systemStatus.memory.used)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Free Memory</span>
                  <span className="font-bold">{formatBytes(systemStatus.memory.free)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Available Memory</span>
                  <span className="font-bold">{formatBytes(systemStatus.memory.available)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Usage Percentage</span>
                  <span className="font-bold">{systemStatus.memory.percent.toFixed(2)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={systemStatus.memory.percent} className="h-4" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disk Tab */}
        <TabsContent value="disk" className="space-y-4">
          {systemStatus.disk.map((disk, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Disk Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Mountpoint: {disk.mountpoint}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Space</p>
                    <p className="text-xl font-bold">{formatBytes(disk.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Used Space</p>
                    <p className="text-xl font-bold">{formatBytes(disk.used)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Free Space</p>
                    <p className="text-xl font-bold">{formatBytes(disk.free)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usage</p>
                    <p className="text-xl font-bold">{disk.percent.toFixed(1)}%</p>
                    {getStatusBadge(disk.percent)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={disk.percent}
                    className="h-4"
                    indicatorClassName={getStatusColor(disk.percent)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitor;
