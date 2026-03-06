/**
 * WordPress API 提供者
 * 为应用提供 WordPress 数据和状态管理
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 创建 QueryClient 实例
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return createQueryClient();
  } else {
    // Browser: create a new QueryClient if needed
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
};

// Context 类型
interface WordPressContextType {
  apiURL: string;
  cdnURL: string;
}

const WordPressContext = createContext<WordPressContextType | undefined>(undefined);

// Provider Props
interface WordPressProviderProps {
  children: ReactNode;
  apiURL?: string;
  cdnURL?: string;
}

/**
 * WordPress Provider 组件
 */
export function WordPressProvider({
  children,
  apiURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json',
  cdnURL = process.env.NEXT_PUBLIC_WORDPRESS_CDN_URL || '',
}: WordPressProviderProps) {
  const queryClient = getQueryClient();

  const contextValue: WordPressContextType = {
    apiURL,
    cdnURL,
  };

  return (
    <WordPressContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </WordPressContext.Provider>
  );
}

/**
 * 使用 WordPress Context Hook
 */
export function useWordPress() {
  const context = useContext(WordPressContext);
  if (!context) {
    throw new Error('useWordPress must be used within a WordPressProvider');
  }
  return context;
}

/**
 * 使用 WordPress API URL Hook
 */
export function useWordPressAPI() {
  const { apiURL } = useWordPress();
  return apiURL;
}

/**
 * 使用 WordPress CDN URL Hook
 */
export function useWordPressCDN() {
  const { cdnURL } = useWordPress();
  return cdnURL;
}

export default WordPressProvider;
