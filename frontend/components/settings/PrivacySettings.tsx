'use client';

import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';

interface PrivacySettingsProps {
  onSave?: (settings: PrivacyConfig) => Promise<void>;
  className?: string;
}

interface PrivacyConfig {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showActivity: boolean;
  allowMessages: boolean;
  showOnlineStatus: boolean;
  dataSharing: boolean;
  analytics: boolean;
}

/**
 * 隐私设置组件
 * 控制用户数据的可见性和共享选项
 */
export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  onSave,
  className
}) => {
  const [settings, setSettings] = useState<PrivacyConfig>({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    allowMessages: true,
    showOnlineStatus: true,
    dataSharing: false,
    analytics: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: keyof PrivacyConfig, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave?.(settings);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can view your profile',
      icon: Globe
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can view your profile',
      icon: Lock
    },
    {
      value: 'friends',
      label: 'Friends Only',
      description: 'Only friends can view your profile',
      icon: Shield
    }
  ] as const;

  return (
    <div className={cn('privacy-settings', className)}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Profile Visibility
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {visibilityOptions.map(({ value, label, description, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleChange('profileVisibility', value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-left',
                    settings.profileVisibility === value
                      ? 'border-cyber-cyan bg-cyber-cyan/10'
                      : 'border-cyber-cyan/20 bg-cyber-muted/30 hover:border-cyber-cyan/50'
                  )}
                >
                  <Icon className={cn(
                    'w-6 h-6',
                    settings.profileVisibility === value
                      ? 'text-cyber-cyan'
                      : 'text-cyber-cyan/60'
                  )} />
                  <div>
                    <div className={cn(
                      'font-medium text-sm',
                      settings.profileVisibility === value
                        ? 'text-cyber-cyan'
                        : 'text-cyber-cyan/80'
                    )}>
                      {label}
                    </div>
                    <div className="text-xs text-cyber-cyan/60 mt-1">
                      {description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Personal Information
            </label>
            <div className="space-y-3">
              <PrivacySwitch
                icon={<Mail className="w-5 h-5" />}
                label="Show email address on profile"
                description="Allow other users to see your email address"
                checked={settings.showEmail}
                onChange={(checked) => handleChange('showEmail', checked)}
              />
              <PrivacySwitch
                icon={<Activity className="w-5 h-5" />}
                label="Show activity status"
                description="Let others see when you're active"
                checked={settings.showActivity}
                onChange={(checked) => handleChange('showActivity', checked)}
              />
              <PrivacySwitch
                icon={<Eye className="w-5 h-5" />}
                label="Show online status"
                description="Display when you're online"
                checked={settings.showOnlineStatus}
                onChange={(checked) => handleChange('showOnlineStatus', checked)}
              />
            </div>
          </div>

          {/* Communication */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Communication
            </label>
            <div className="space-y-3">
              <PrivacySwitch
                icon={<MessageCircle className="w-5 h-5" />}
                label="Allow messages from anyone"
                description="Let anyone send you direct messages"
                checked={settings.allowMessages}
                onChange={(checked) => handleChange('allowMessages', checked)}
              />
            </div>
          </div>

          {/* Data & Analytics */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Data & Analytics
            </label>
            <div className="space-y-3">
              <PrivacySwitch
                icon={<Share2 className="w-5 h-5" />}
                label="Data sharing"
                description="Allow sharing anonymous usage data to improve the service"
                checked={settings.dataSharing}
                onChange={(checked) => handleChange('dataSharing', checked)}
              />
              <PrivacySwitch
                icon={<BarChart3 className="w-5 h-5" />}
                label="Analytics"
                description="Help us understand how you use the platform"
                checked={settings.analytics}
                onChange={(checked) => handleChange('analytics', checked)}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-cyber-pink/30">
            <h4 className="text-sm font-medium text-cyber-pink mb-3">
              Danger Zone
            </h4>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="border-cyber-pink/50 text-cyber-pink hover:bg-cyber-pink/10"
              >
                Download My Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-cyber-pink/50 text-cyber-pink hover:bg-cyber-pink/10 ml-2"
              >
                Deactivate Account
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-cyber-cyan/20">
            <Button
              onClick={handleSave}
              variant="primary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Privacy Settings'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface PrivacySwitchProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PrivacySwitch: React.FC<PrivacySwitchProps> = ({
  icon,
  label,
  description,
  checked,
  onChange
}) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-cyber-muted/30 border border-cyber-cyan/20">
      <div className="flex-shrink-0 mt-1 text-cyber-cyan/60">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-cyber-cyan/80">
              {label}
            </div>
            <div className="text-xs text-cyber-cyan/60 mt-0.5">
              {description}
            </div>
          </div>
          <Switch
            checked={checked}
            onCheckedChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

// Icons imports
import { Mail, Activity, MessageCircle, Share2, BarChart3 } from 'lucide-react';

export default PrivacySettings;
