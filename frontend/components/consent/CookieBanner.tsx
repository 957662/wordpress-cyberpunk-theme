'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { setAnalyticsConsent, getAnalyticsConsent } from '@/lib/monitoring/analytics';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CookieBannerProps {
  description?: string;
  privacyPolicyUrl?: string;
  acceptButtonText?: string;
  declineButtonText?: string;
  position?: 'bottom' | 'top';
}

/**
 * CookieBanner Component
 *
 * GDPR-compliant cookie consent banner with analytics integration.
 * Features:
 * - GDPR/CCPA compliant
 * - Animated entrance/exit
 * - Persistent consent storage
 * - Analytics integration
 * - Customizable styling
 */
export const CookieBanner: React.FC<CookieBannerProps> = ({
  description = '我们使用cookie来改善您的体验并分析网站流量。',
  privacyPolicyUrl = '/privacy',
  acceptButtonText = '接受',
  declineButtonText = '拒绝',
  position = 'bottom',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useLocalStorage('cookie_consent', null);

  useEffect(() => {
    // Show banner if no consent has been given
    if (consent === null) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [consent]);

  const handleAccept = () => {
    setConsent('accepted');
    setAnalyticsConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setConsent('declined');
    setAnalyticsConsent(false);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${positionClasses[position]} z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-cyan-500/30`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Content */}
            <div className="flex-1 text-white">
              <p className="text-sm sm:text-base">
                {description}{' '}
                <a
                  href={privacyPolicyUrl}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  隐私政策
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
              >
                {declineButtonText}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 text-sm font-medium bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                {acceptButtonText}
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="关闭"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * CookieSettings - Advanced cookie consent settings
 */
export const CookieSettings: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useLocalStorage('consent_analytics', false);
  const [marketing, setMarketing] = useLocalStorage('consent_marketing', false);
  const [preferences, setPreferences] = useLocalStorage('consent_preferences', true);

  if (!isOpen) return null;

  const handleSave = () => {
    setAnalyticsConsent(analytics);
    onClose();
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    setPreferences(true);
    setAnalyticsConsent(true);
    onClose();
  };

  const handleDeclineAll = () => {
    setAnalytics(false);
    setMarketing(false);
    setPreferences(false);
    setAnalyticsConsent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-gray-900 rounded-lg border border-cyan-500/30 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Cookie 设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-gray-300">
            请选择您允许的cookie类型。这些信息帮助我们改善您的体验。
          </p>

          {/* Options */}
          <div className="space-y-4">
            <CookieOption
              name="必要 Cookie"
              description="这些cookie对于网站运行是必需的，无法禁用。"
              checked={true}
              disabled={true}
            />

            <CookieOption
              name="偏好 Cookie"
              description="记住您的设置和偏好。"
              checked={preferences}
              onChange={setPreferences}
            />

            <CookieOption
              name="分析 Cookie"
              description="帮助我们了解用户如何使用网站。"
              checked={analytics}
              onChange={setAnalytics}
            />

            <CookieOption
              name="营销 Cookie"
              description="用于展示相关广告和营销活动。"
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700">
          <button
            onClick={handleDeclineAll}
            className="flex-1 px-4 py-3 text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            全部拒绝
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            保存设置
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg transition-colors"
          >
            全部接受
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface CookieOptionProps {
  name: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const CookieOption: React.FC<CookieOptionProps> = ({
  name,
  description,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg ${disabled ? 'bg-gray-800/50' : 'bg-gray-800'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className={`mt-1 w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      />
      <div className="flex-1">
        <h3 className={`font-semibold text-white ${disabled ? 'opacity-50' : ''}`}>
          {name}
        </h3>
        <p className={`text-sm text-gray-400 mt-1 ${disabled ? 'opacity-50' : ''}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

/**
 * useCookieConsent Hook - Hook to check and manage cookie consent
 */
export const useCookieConsent = () => {
  const [consent] = useLocalStorage<'accepted' | 'declined' | null>('cookie_consent', null);
  const [analyticsConsent] = useLocalStorage('consent_analytics', false);

  return {
    hasConsented: consent === 'accepted',
    hasDeclined: consent === 'declined',
    analyticsConsent,
    canTrackAnalytics: consent === 'accepted' && analyticsConsent,
  };
};

export default CookieBanner;
