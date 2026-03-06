export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => { timeout = null; func(...args); };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) { func(...args); inThrottle = true; setTimeout(() => (inThrottle = false), limit); }
  };
}

export function rafThrottle<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => { func(...args); rafId = null; });
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function batch<T>(items: T[], batchSize: number, processor: (batch: T[]) => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) { batches.push(items.slice(i, i + batchSize)); }
    let index = 0;
    const processNext = async () => {
      if (index >= batches.length) { resolve(); return; }
      try { await processor(batches[index]); index++; if (typeof requestIdleCallback !== 'undefined') { requestIdleCallback(() => processNext()); } else { setTimeout(processNext, 0); } } catch (error) { reject(error); }
    };
    processNext();
  });
}

export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

export function isPartiallyInViewport(element: HTMLElement, threshold = 0.5): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
  const visibleWidth = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0));
  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = rect.width * rect.height;
  return visibleArea / totalArea >= threshold;
}

export function observeElement(element: HTMLElement, callback: (entry: IntersectionObserverEntry) => void, options: IntersectionObserverInit = {}): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0.1, ...options };
  const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { callback(entry); } }); }, defaultOptions);
  observer.observe(element);
  return observer;
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  record(name: string, duration: number): void { if (!this.metrics.has(name)) { this.metrics.set(name, []); } this.metrics.get(name)!.push(duration); }
  measure<T>(name: string, fn: () => T): T { const start = performance.now(); const result = fn(); const duration = performance.now() - start; this.record(name, duration); return result; }
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> { const start = performance.now(); const result = await fn(); const duration = performance.now() - start; this.record(name, duration); return result; }
  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const durations = this.metrics.get(name);
    if (!durations || durations.length === 0) return null;
    return { avg: durations.reduce((a, b) => a + b, 0) / durations.length, min: Math.min(...durations), max: Math.max(...durations), count: durations.length };
  }
  getAllStats(): Record<string, ReturnType<PerformanceMonitor['getStats']>> { const stats: Record<string, ReturnType<PerformanceMonitor['getStats']>> = {}; this.metrics.forEach((_, name) => { stats[name] = this.getStats(name); }); return stats; }
  clear(): void { this.metrics.clear(); }
}

export function lazyLoadImage(imgElement: HTMLImageElement, src: string, placeholder?: string): void {
  if (placeholder) imgElement.src = placeholder;
  const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { imgElement.src = src; imgElement.onload = () => { imgElement.classList.add('loaded'); }; observer.unobserve(imgElement); } }); });
  observer.observe(imgElement);
}
