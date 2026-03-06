import { useOnline } from './useOnline';

/**
 * 离线状态 Hook
 */
export function useOffline(): boolean {
  const isOnline = useOnline();
  return !isOnline;
}
