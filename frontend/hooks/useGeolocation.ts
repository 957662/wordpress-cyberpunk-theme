'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  /**
   * 纬度
   */
  latitude: number | null;

  /**
   * 经度
   */
  longitude: number | null;

  /**
   * 精度（米）
   */
  accuracy: number | null;

  /**
   * 海拔（米）
   */
  altitude: number | null;

  /**
   * 海拔精度（米）
   */
  altitudeAccuracy: number | null;

  /**
   * 方向（度）
   */
  heading: number | null;

  /**
   * 速度（米/秒）
   */
  speed: number | null;

  /**
   * 位置时间戳
   */
  timestamp: number | null;
}

export interface GeolocationError {
  /**
   * 错误代码
   */
  code: number;

  /**
   * 错误消息
   */
  message: string;

  /**
   * 错误类型
   */
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN';
}

export interface GeolocationOptions {
  /**
   * 是否启用高精度
   */
  enableHighAccuracy?: boolean;

  /**
   * 超时时间（毫秒）
   */
  timeout?: number;

  /**
   * 缓存时间（毫秒）
   */
  maximumAge?: number;

  /**
   * 是否监听位置变化
   */
  watch?: boolean;
}

const initialState: GeolocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  timestamp: null,
};

/**
 * useGeolocation - 地理位置定位 Hook
 *
 * 获取用户的地理位置信息
 *
 * @example
 * ```tsx
 * const { location, error, loading } = useGeolocation();
 *
 * const { location, error, getCurrentPosition } = useGeolocation({
 *   enableHighAccuracy: true,
 *   timeout: 10000,
 *   watch: true,
 * });
 *
 * <button onClick={getCurrentPosition}>刷新位置</button>
 * ```
 */
export function useGeolocation(options: GeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const [location, setLocation] = useState<GeolocationState>(initialState);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((err: GeolocationPositionError) => {
    const errorTypes: Record<number, GeolocationError['type']> = {
      1: 'PERMISSION_DENIED',
      2: 'POSITION_UNAVAILABLE',
      3: 'TIMEOUT',
    };

    setError({
      code: err.code,
      message: err.message,
      type: errorTypes[err.code] || 'UNKNOWN',
    });
    setLoading(false);
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
    });
    setError(null);
    setLoading(false);
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (typeof window === 'undefined' || !window.navigator) {
      handleError({
        code: 0,
        message: 'Geolocation is not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        UNKNOWN: 'UNKNOWN',
      } as GeolocationPositionError);
      return;
    }

    setLoading(true);

    if (!window.navigator.geolocation) {
      handleError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        UNKNOWN: 'UNKNOWN',
      } as GeolocationPositionError);
      return;
    }

    window.navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  useEffect(() => {
    if (!watch) {
      getCurrentPosition();
      return;
    }

    let watchId: number;

    if (typeof window !== 'undefined' && window.navigator?.geolocation) {
      setLoading(true);
      watchId = window.navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    }

    return () => {
      if (watchId !== undefined) {
        window.navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError, getCurrentPosition]);

  return {
    location,
    error,
    loading,
    getCurrentPosition,
  };
}

/**
 * useDistance - 计算两点间距离的 Hook
 *
 * 基于地理位置计算距离
 *
 * @example
 * ```tsx
 * const distance = useDistance(
 *   { latitude: 40.7128, longitude: -74.0060 }, // 纽约
 *   { latitude: 34.0522, longitude: -118.2437 } // 洛杉矶
 * );
 * console.log(`${distance} km`); // 约 3944 km
 * ```
 */
export function useDistance(
  from: { latitude: number; longitude: number } | null,
  to: { latitude: number; longitude: number } | null
): number | null {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!from || !to) {
      setDistance(null);
      return;
    }

    // 使用 Haversine 公式计算两点间距离
    const R = 6371; // 地球半径（公里）
    const dLat = toRadians(to.latitude - from.latitude);
    const dLon = toRadians(to.longitude - from.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    setDistance(Math.round(d * 10) / 10); // 保留一位小数
  }, [from, to]);

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * useGeolocationWatch - 监听地理位置变化的 Hook
 *
 * 持续监听用户位置变化
 *
 * @example
 * ```tsx
 * const { location, error, startWatching, stopWatching, isWatching } = useGeolocationWatch({
 *   enableHighAccuracy: true,
 * });
 *
 * <button onClick={startWatching}>开始追踪</button>
 * <button onClick={stopWatching}>停止追踪</button>
 * ```
 */
export function useGeolocationWatch(options: GeolocationOptions = {}) {
  const [location, setLocation] = useState<GeolocationState>(initialState);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startWatching = useCallback(() => {
    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported',
        type: 'UNKNOWN',
      });
      return;
    }

    if (isWatching) return;

    const id = window.navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
        setError(null);
      },
      (err) => {
        const errorTypes: Record<number, GeolocationError['type']> = {
          1: 'PERMISSION_DENIED',
          2: 'POSITION_UNAVAILABLE',
          3: 'TIMEOUT',
        };

        setError({
          code: err.code,
          message: err.message,
          type: errorTypes[err.code] || 'UNKNOWN',
        });
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );

    setWatchId(id);
    setIsWatching(true);
  }, [isWatching, options]);

  const stopWatching = useCallback(() => {
    if (watchId !== null && typeof window !== 'undefined') {
      window.navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null && typeof window !== 'undefined') {
        window.navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    error,
    isWatching,
    startWatching,
    stopWatching,
  };
}
