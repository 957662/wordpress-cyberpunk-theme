/**
 * 用户资料组件
 * 显示用户信息和快捷操作
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  Edit,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth, usePermissions } from '@/lib/hooks/useAuth';
import { AvatarUpload } from '@/components/ui/AvatarUpload';

export interface UserProfileProps {
  variant?: 'header' | 'sidebar' | 'card';
  showActions?: boolean;
  onEdit?: () => void;
  onSettings?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  variant = 'header',
  showActions = true,
  onEdit,
  onSettings,
}) => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { canEdit, canPublish } = usePermissions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsDropdownOpen(false);
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    setIsLoading(true);
    await updateProfile({ avatar: avatarUrl });
    setIsLoading(false);
  };

  const displayName = user.name || user.username;
  const userEmail = user.email;

  // 下拉菜单变体
  if (variant === 'header' || variant === 'sidebar') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyber-dark/50 transition-colors group"
        >
          <Avatar
            src={user.avatar}
            alt={displayName}
            size="sm"
            className="ring-2 ring-cyber-cyan/50 group-hover:ring-cyber-cyan transition-all"
          />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-cyber-cyan transition-colors">
              {displayName}
            </p>
            {userEmail && (
              <p className="text-xs text-gray-400">{userEmail}</p>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* 遮罩 */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* 下拉菜单 */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 top-full mt-2 w-64 z-20 ${
                  variant === 'sidebar' ? 'left-0 right-auto' : ''
                }`}
              >
                <Card className="overflow-hidden border-cyber-cyan/20">
                  {/* 用户信息头部 */}
                  <div className="p-4 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 border-b border-cyber-cyan/20">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar
                          src={user.avatar}
                          alt={displayName}
                          size="md"
                        />
                        <button
                          onClick={() => setIsAvatarUploadOpen(true)}
                          className="absolute -bottom-1 -right-1 p-1.5 bg-cyber-cyan rounded-full hover:bg-cyber-cyan/80 transition-colors"
                          title="更改头像"
                        >
                          <Edit className="w-3 h-3 text-black" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 角色标签 */}
                  <div className="px-4 py-2 border-b border-cyber-cyan/10">
                    <div className="flex flex-wrap gap-2">
                      {isAdmin() && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-cyber-purple/20 text-cyber-purple rounded-full border border-cyber-purple/30">
                          <Shield className="w-3 h-3" />
                          管理员
                        </span>
                      )}
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded-full border border-cyber-cyan/20"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 操作菜单 */}
                  {showActions && (
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onEdit?.();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        编辑资料
                      </button>

                      <button
                        onClick={() => {
                          onSettings?.();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        账户设置
                      </button>

                      <div className="my-2 border-t border-gray-700" />

                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoading ? '登出中...' : '退出登录'}
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 头像上传模态框 */}
        <AvatarUpload
          isOpen={isAvatarUploadOpen}
          onClose={() => setIsAvatarUploadOpen(false)}
          onSave={handleAvatarChange}
          currentAvatar={user.avatar}
        />
      </div>
    );
  }

  // 卡片变体
  return (
    <Card className="p-6 border-cyber-cyan/20">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar
            src={user.avatar}
            alt={displayName}
            size="lg"
          />
          {showActions && (
            <button
              onClick={() => setIsAvatarUploadOpen(true)}
              className="absolute -bottom-1 -right-1 p-2 bg-cyber-cyan rounded-full hover:bg-cyber-cyan/80 transition-colors shadow-lg"
              title="更改头像"
            >
              <Edit className="w-4 h-4 text-black" />
            </button>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {displayName}
          </h3>
          <p className="text-sm text-gray-400 mb-3">{userEmail}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {isAdmin() && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-cyber-purple/20 text-cyber-purple rounded-full border border-cyber-purple/30">
                <Shield className="w-3 h-3" />
                管理员
              </span>
            )}
            {user.roles?.map((role) => (
              <span
                key={role}
                className="px-3 py-1 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded-full border border-cyber-cyan/20"
              >
                {role}
              </span>
            ))}
          </div>

          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onSettings}
              >
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 头像上传模态框 */}
      <AvatarUpload
        isOpen={isAvatarUploadOpen}
        onClose={() => setIsAvatarUploadOpen(false)}
        onSave={handleAvatarChange}
        currentAvatar={user.avatar}
      />
    </Card>
  );
};

export default UserProfile;
