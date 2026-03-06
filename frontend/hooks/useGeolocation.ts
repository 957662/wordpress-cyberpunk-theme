'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
}

export interface UseGeolocationOptions {
  watch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  onSuccess?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationPositionError) => void;
}

export interface UseGeolocationReturn extends GeolocationState {
  getCurrentPosition: () => Promise<GeolocationPosition>;
  watchPosition: () => void;
  clearWatch: () => void;
}

const initialState: GeolocationState = {
  loading: false,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  latitude: null,
  longitude: null,
  speed: null,
  timestamp: null,
  error: null,
};

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const {
    watch = false,
    enableHighAccuracy = true,
    timeout = 5000,
    maximumAge = 0,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<GeolocationState>(initialState);
  const watchIdRef = useRef<number | null>(null);

  const updatePosition = useCallback((position: GeolocationPosition) => {
    const newState: GeolocationState = {
      loading: false,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      error: null,
    };

    setState(newState);
    onSuccess?.(position);
  }, [onSuccess]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      loading: false,
      error,
    }));
    onError?.(error);
  }, [onError]);

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error: GeolocationPositionError = {
          code: 0,
          message: 'Geolocation is not supported by your browser',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        };
        handleError(error);
        reject(error);
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          updatePosition(position);
          resolve(position);
        },
        (error) => {
          handleError(error);
          reject(error);
        },
        { enableHighAccuracy, timeout, maximumAge }
      );
    });
  }, [enableHighAccuracy, timeout, maximumAge, updatePosition, handleError]);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      const error: GeolocationPositionError = {
        code: 0,
        message: 'Geolocation is not supported by your browser',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      };
      handleError(error);
      return;
    }

    if (watchIdRef.current !== null) {
      return; // 已经在监听
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const id = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    watchIdRef.current = id;
  }, [enableHighAccuracy, timeout, maximumAge, updatePosition, handleError]);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // 自动开始监听（如果 watch 为 true）
  useEffect(() => {
    if (watch) {
      watchPosition();
    }

    return () => {
      clearWatch();
    };
  }, [watch, watchPosition, clearWatch]);

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    clearWatch,
  };
}

export default useGeolocation;
