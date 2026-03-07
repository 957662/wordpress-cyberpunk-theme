/**
 * Performance Types
 */

export interface Performance {
  // Navigation Timing
  dns: number;
  tcp: number;
  ttfb: number;
  download: number;
  domLoad: number;
  windowLoad: number;
  total: number;

  // Paint Timing
  fcp: number;
  lcp: number;

  // Layout Shift
  cls: number;

  // Interaction
  fid: number;
}

export interface PerformanceReport {
  url: string;
  timestamp: number;
  metrics: Performance;
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
  devicePixelRatio: number;
  connectionType?: string;
  effectiveType?: string;
}

export interface PerformanceThresholds {
  fcp: {
    good: number;
    needsImprovement: number;
  };
  lcp: {
    good: number;
    needsImprovement: number;
  };
  cls: {
    good: number;
    needsImprovement: number;
  };
  fid: {
    good: number;
    needsImprovement: number;
  };
  ttfb: {
    good: number;
    needsImprovement: number;
  };
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fid: { good: 100, needsImprovement: 300 },
  ttfb: { good: 600, needsImprovement: 1500 },
};
