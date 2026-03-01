/**
 * 数学工具函数库
 *
 * 提供常用的数学运算和工具函数
 */

/**
 * 角度转弧度
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * 弧度转角度
 */
export const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * 将数值限制在指定范围内
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 线性插值
 */
export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

/**
 * 反线性插值
 */
export const inverseLerp = (value: number, start: number, end: number): number => {
  return (value - start) / (end - start);
};

/**
 * 重新映射数值范围
 */
export const remap = (
  value: number,
  sourceMin: number,
  sourceMax: number,
  targetMin: number,
  targetMax: number
): number => {
  return lerp(targetMin, targetMax, inverseLerp(value, sourceMin, sourceMax));
};

/**
 * 检查数值是否在范围内
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 数值平滑阻尼
 */
export const damp = (
  current: number,
  target: number,
  smoothing: number,
  deltaTime: number
): number => {
  return lerp(current, target, 1 - Math.exp(-smoothing * deltaTime));
};

/**
 * 弹性插值
 */
export const elasticLerp = (start: number, end: number, progress: number): number => {
  const p = 0.3;
  return lerp(start, end, 1 - Math.pow(2, -10 * progress) * Math.cos(((progress - p / 4) * (2 * Math.PI)) / p));
};

/**
 * 反弹插值
 */
export const bounceLerp = (start: number, end: number, progress: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  let t = progress;
  if (t < 1 / d1) {
    return lerp(start, end, n1 * t * t);
  } else if (t < 2 / d1) {
    t -= 1.5 / d1;
    return lerp(start, end, n1 * t * t + 0.75);
  } else if (t < 2.5 / d1) {
    t -= 2.25 / d1;
    return lerp(start, end, n1 * t * t + 0.9375);
  } else {
    t -= 2.625 / d1;
    return lerp(start, end, n1 * t * t + 0.984375);
  }
};

/**
 * 四舍五入到指定小数位
 */
export const roundTo = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * 向上取整到指定倍数
 */
export const ceilTo = (value: number, multiple: number): number => {
  return Math.ceil(value / multiple) * multiple;
};

/**
 * 向下取整到指定倍数
 */
export const floorTo = (value: number, multiple: number): number => {
  return Math.floor(value / multiple) * multiple;
};

/**
 * 生成随机数
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机整数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(random(min, max + 1));
};

/**
 * 生成高斯分布随机数
 */
export const randomGaussian = (mean: number = 0, standardDeviation: number = 1): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * standardDeviation + mean;
};

/**
 * 计算两点距离
 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * 计算两点角度
 */
export const angle = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.atan2(y2 - y1, x2 - x1);
};

/**
 * 极坐标转笛卡尔坐标
 */
export const polarToCartesian = (radius: number, angle: number): { x: number; y: number } => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};

/**
 * 笛卡尔坐标转极坐标
 */
export const cartesianToPolar = (x: number, y: number): { radius: number; angle: number } => {
  return {
    radius: Math.sqrt(x * x + y * y),
    angle: Math.atan2(y, x),
  };
};

/**
 * 平滑阶梯函数
 */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * 更平滑的阶梯函数
 */
export const smootherstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * 数值归一化
 */
export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

/**
 * 线性映射
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * 计算百分比
 */
export const percentage = (value: number, total: number): number => {
  return (value / total) * 100;
};

/**
 * 计算总和
 */
export const sum = (...numbers: number[]): number => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

/**
 * 计算平均值
 */
export const average = (...numbers: number[]): number => {
  return sum(...numbers) / numbers.length;
};

/**
 * 计算中位数
 */
export const median = (...numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * 计算标准差
 */
export const standardDeviation = (...numbers: number[]): number => {
  const avg = average(...numbers);
  const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = average(...squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

/**
 * 计算方差
 */
export const variance = (...numbers: number[]): number => {
  const avg = average(...numbers);
  return numbers.reduce((acc, num) => acc + Math.pow(num - avg, 2), 0) / numbers.length;
};

/**
 * 最大公约数
 */
export const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

/**
 * 最小公倍数
 */
export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};

/**
 * 阶乘
 */
export const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

/**
 * 斐波那契数列
 */
export const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

/**
 * 判断是否为质数
 */
export const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

/**
 * 数字格式化（添加千位分隔符）
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return num.toLocaleString(locale);
};

/**
 * 文件大小格式化
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * 百分比格式化
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals) + '%';
};

/**
 * 货币格式化
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * 计数器类
 */
export class Counter {
  private count: number = 0;

  constructor(initial: number = 0) {
    this.count = initial;
  }

  increment(amount: number = 1): number {
    return (this.count += amount);
  }

  decrement(amount: number = 1): number {
    return (this.count -= amount);
  }

  reset(): number {
    return (this.count = 0);
  }

  get value(): number {
    return this.count;
  }

  set value(val: number) {
    this.count = val;
  }
}

/**
 * 范围类
 */
export class Range {
  constructor(
    public min: number,
    public max: number
  ) {}

  get range(): number {
    return this.max - this.min;
  }

  get center(): number {
    return (this.min + this.max) / 2;
  }

  contains(value: number): boolean {
    return isInRange(value, this.min, this.max);
  }

  clamp(value: number): number {
    return Math.min(Math.max(value, this.min), this.max);
  }

  normalize(value: number): number {
    return normalize(value, this.min, this.max);
  }

  lerp(progress: number): number {
    return lerp(this.min, this.max, progress);
  }

  random(): number {
    return random(this.min, this.max);
  }
}

/**
 * 向量运算
 */
export const vector = {
  add: (v1: [number, number], v2: [number, number]): [number, number] => {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  },

  subtract: (v1: [number, number], v2: [number, number]): [number, number] => {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  },

  multiply: (v: [number, number], scalar: number): [number, number] => {
    return [v[0] * scalar, v[1] * scalar];
  },

  divide: (v: [number, number], scalar: number): [number, number] => {
    return [v[0] / scalar, v[1] / scalar];
  },

  magnitude: (v: [number, number]): number => {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  },

  normalize: (v: [number, number]): [number, number] => {
    const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    return mag === 0 ? [0, 0] : [v[0] / mag, v[1] / mag];
  },

  dot: (v1: [number, number], v2: [number, number]): number => {
    return v1[0] * v2[0] + v1[1] * v2[1];
  },

  distance: (v1: [number, number], v2: [number, number]): number => {
    return Math.sqrt(Math.pow(v2[0] - v1[0], 2) + Math.pow(v2[1] - v1[1], 2));
  },

  lerp: (v1: [number, number], v2: [number, number], t: number): [number, number] => {
    return [lerp(v1[0], v2[0], t), lerp(v1[1], v2[1], t)];
  },
};
