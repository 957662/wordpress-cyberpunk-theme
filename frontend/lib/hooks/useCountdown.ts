/**
 * useCountdown Hook
 * 倒计时 Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useCountdown(
  initialSeconds: number,
  autoStart: boolean = true
) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 启动倒计时
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // 暂停倒计时
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // 重置倒计时
  const reset = useCallback((newSeconds?: number) => {
    setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  // 重启倒计时
  const restart = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (seconds <= 0) {
      setIsRunning(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    restart,
    isComplete: seconds === 0,
  };
}

/**
 * 倒计时到指定日期的 Hook
 */
export function useCountdownToDate(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isComplete = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return {
    ...timeLeft,
    isComplete,
    totalSeconds:
      timeLeft.days * 86400 +
      timeLeft.hours * 3600 +
      timeLeft.minutes * 60 +
      timeLeft.seconds,
  };
}
