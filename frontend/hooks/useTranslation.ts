/**
 * useTranslation - 国际化 Hook
 * 便捷的翻译 Hook
 */

'use client';

import { useTranslation as useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function useTranslation() {
  const { locale, setLocale, t } = useI18n();

  return {
    locale,
    setLocale,
    t,

    // 便捷方法
    isZhCN: locale === 'zh-CN',
    isEnUS: locale === 'en-US',

    // 切换到中文
    toZhCN: () => setLocale('zh-CN'),

    // 切换到英文
    toEnUS: () => setLocale('en-US'),

    // 切换语言
    toggle: () => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN'),
  };
}

export default useTranslation;
