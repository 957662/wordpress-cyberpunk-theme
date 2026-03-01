/**
 * useBattery Hook
 *
 * 获取电池状态的 Hook
 */

import { useState, useEffect } from 'react';

/**
 * 电池状态
 */
export interface BatteryState {
  charging: boolean;
  level: number;
  chargingTime: number | null;
  dischargingTime: number | null;
  supported: boolean;
}

/**
 * 默认电池状态
 */
const defaultState: BatteryState = {
  charging: false,
  level: 1,
  chargingTime: null,
  dischargingTime: null,
  supported: false,
};

/**
 * useBattery Hook
 * @returns 电池状态
 */
export function useBattery(): BatteryState {
  const [battery, setBattery] = useState<BatteryState>(defaultState);

  useEffect(() => {
    let battery: any = null;

    // 检查浏览器是否支持电池 API
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((batteryManager: any) => {
        battery = batteryManager;

        const updateBattery = () => {
          setBattery({
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            supported: true,
          });
        };

        // 初始化
        updateBattery();

        // 添加事件监听
        battery.addEventListener('chargingchange', updateBattery);
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingtimechange', updateBattery);
        battery.addEventListener('dischargingtimechange', updateBattery);

        // 清理
        return () => {
          battery.removeEventListener('chargingchange', updateBattery);
          battery.removeEventListener('levelchange', updateBattery);
          battery.removeEventListener('chargingtimechange', updateBattery);
          battery.removeEventListener('dischargingtimechange', updateBattery);
        };
      });
    }

    return () => {};
  }, []);

  return battery;
}

/**
 * useBatteryWithWarning Hook
 * 带低电量警告的电池 Hook
 */
export interface BatteryWithWarning extends BatteryState {
  isLow: boolean;
  isCritical: boolean;
  warningThreshold: number;
  criticalThreshold: number;
}

export function useBatteryWithWarning(
  warningThreshold: number = 0.2,
  criticalThreshold: number = 0.1
): BatteryWithWarning {
  const battery = useBattery();

  const isLow = battery.level <= warningThreshold && !battery.charging;
  const isCritical = battery.level <= criticalThreshold && !battery.charging;

  return {
    ...battery,
    isLow,
    isCritical,
    warningThreshold,
    criticalThreshold,
  };
}
