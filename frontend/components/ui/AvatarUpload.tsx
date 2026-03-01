'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * AvatarUpload - 用户头像上传组件
 * 支持拖拽上传、图片裁剪、预览、删除
 */

export interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => void | Promise<void>;
  onRemove?: () => void | Promise<void>;
  size?: number;
  shape?: 'circle' | 'square' | 'rounded';
  maxSize?: number; // in MB
  accept?: string;
  disabled?: boolean;
  showPreview?: boolean;
  editable?: boolean;
  className?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUpload,
  onRemove,
  size = 128,
  shape = 'circle',
  maxSize = 5,
  accept = 'image/*',
  disabled = false,
  showPreview = true,
  editable = true,
  className,
  onSuccess,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatar);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        const errorMsg = 'Please select an image file';
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        const errorMsg = `File size must be less than ${maxSize}MB`;
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      setIsUploading(true);
      try {
        await onUpload(file);
        onSuccess?.(previewUrl || '');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMsg);
        onError?.(errorMsg);
        setPreviewUrl(currentAvatar);
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, onUpload, currentAvatar, previewUrl, onSuccess, onError]
  );

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle click
  const handleClick = () => {
    if (!disabled && !isUploading && editable) {
      fileInputRef.current?.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle remove
  const handleRemove = async () => {
    setPreviewUrl(undefined);
    await onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar */}
      <motion.div
        className={cn(
          'relative overflow-hidden border-2 border-dashed transition-all',
          shapeClasses[shape],
          isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-gray-600 hover:border-gray-500',
          disabled && 'opacity-50 cursor-not-allowed',
          editable && !disabled && 'cursor-pointer'
        )}
        style={{ width: size, height: size }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        whileHover={editable && !disabled && !isUploading ? { scale: 1.02 } : {}}
        whileTap={editable && !disabled && !isUploading ? { scale: 0.98 } : {}}
      >
        {/* Preview Image */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50 text-gray-400">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs text-center px-2">Upload photo</span>
          </div>
        )}

        {/* Overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-cyan-400 font-medium">Drop image here</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Button */}
        {editable && !disabled && previewUrl && !isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Upload Button */}
        {editable && !disabled && (
          <motion.button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isUploading ? 'Uploading...' : previewUrl ? 'Change Photo' : 'Upload Photo'}
          </motion.button>
        )}

        {/* Remove Button */}
        {previewUrl && onRemove && !disabled && (
          <motion.button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Remove
          </motion.button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-sm text-red-400 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!previewUrl && (
        <p className="text-xs text-gray-500 text-center">
          Max file size: {maxSize}MB
        </p>
      )}
    </div>
  );
};

// ==================== 头像组组件 ====================

export interface AvatarGroupProps {
  avatars: Array<{
    src: string;
    alt?: string;
    title?: string;
  }>;
  size?: number;
  max?: number;
  overlap?: number;
  shape?: 'circle' | 'square';
  className?: string;
  onAvatarClick?: (index: number) => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 40,
  max = 5,
  overlap = 10,
  shape = 'circle',
  className,
  onAvatarClick,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-md',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {visibleAvatars.map((avatar, index) => (
        <motion.div
          key={index}
          className={cn(
            'relative border-2 border-gray-900 overflow-hidden',
            shapeClasses[shape]
          )}
          style={{
            width: size,
            height: size,
            marginLeft: index > 0 ? `-${overlap}px` : 0,
          }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          onClick={() => onAvatarClick?.(index)}
        >
          <img
            src={avatar.src}
            alt={avatar.alt || `Avatar ${index + 1}`}
            title={avatar.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}

      {/* Remaining Count */}
      {remainingCount > 0 && (
        <motion.div
          className={cn(
            'relative flex items-center justify-center bg-gray-800 text-gray-400 text-xs font-medium border-2 border-gray-900',
            shapeClasses[shape]
          )}
          style={{
            width: size,
            height: size,
            marginLeft: `-${overlap}px`,
          }}
          whileHover={{ scale: 1.1 }}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
};

// ==================== 用户资料卡片组件 ====================

export interface ProfileCardProps {
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: React.ReactNode;
  }>;
  editable?: boolean;
  onEdit?: () => void;
  onAvatarChange?: (file: File) => void | Promise<void>;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  username,
  avatar,
  bio,
  location,
  website,
  stats,
  socialLinks,
  editable = false,
  onEdit,
  onAvatarChange,
  className,
}) => {
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  return (
    <div
      className={cn(
        'rounded-lg border backdrop-blur-sm overflow-hidden',
        'bg-gray-900/50 border-cyan-500/20',
        className
      )}
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />

      {/* Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <AvatarUpload
            currentAvatar={avatar}
            onUpload={onAvatarChange || (() => {})}
            size={128}
            editable={editable}
          />
        </div>

        {/* Edit Button */}
        {editable && onEdit && (
          <motion.button
            onClick={onEdit}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Edit Profile
          </motion.button>
        )}

        {/* Info */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
          {username && (
            <p className="text-gray-400 text-sm mb-3">@{username}</p>
          )}

          {bio && <p className="text-gray-300 text-sm mb-4">{bio}</p>}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
            {location && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{location}</span>
              </div>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex gap-6 mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all"
                  title={link.platform}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
