'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Settings,
  Mail,
  Share2,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FollowButton } from '../follow/FollowButton';
import { SocialStatsCard } from '../social/SocialStatsCard';
import { socialApi } from '@/lib/api/social';

interface ProfileHeaderProps {
  userId: string;
  currentUserId?: string;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
  className?: string;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  email?: string;
  joinedAt: string;
  verified?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  currentUserId,
  isOwnProfile = false,
  onEdit,
  onMessage,
  className,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    if (!isOwnProfile) {
      fetchFollowStatus();
    }
  }, [userId, isOwnProfile]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Mock profile data - in real app, this would come from API
      setProfile({
        id: userId,
        username: 'johndoe',
        displayName: 'John Doe',
        bio: 'Full-stack developer & CyberPress enthusiast. Building the future of web.',
        avatar: undefined,
        coverImage: undefined,
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        email: 'john@example.com',
        joinedAt: '2024-01-15T00:00:00Z',
        verified: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowStatus = async () => {
    try {
      const response = await socialApi.checkFollowStatus(userId);
      if (response.success && response.data) {
        setIsFollowing(response.data.isFollowing);
      }
    } catch (err) {
      console.error('Failed to fetch follow status:', err);
    }
  };

  const handleFollowChange = (following: boolean) => {
    setIsFollowing(following);
  };

  if (isLoading) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-cyber-purple/20 p-6',
        'animate-pulse',
        className
      )}>
        <div className="h-64 bg-cyber-purple/10 rounded" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-red-500/20 p-6',
        className
      )}>
        <p className="text-red-400 text-sm">Failed to load profile</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={cn(
      'rounded-xl overflow-hidden',
      'bg-gradient-to-br from-cyber-dark/80 to-cyber-dark/60',
      'border border-cyber-purple/20',
      className
    )}>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-cyber-purple/20 via-cyber-pink/20 to-cyber-cyan/20">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-cyber-purple/10 flex items-center justify-center">
                <Camera size={32} className="text-cyber-purple/30" />
              </div>
              <p className="text-cyber-muted/50 text-sm">Add cover image</p>
            </div>
          </div>
        )}

        {isOwnProfile && (
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
            onClick={onEdit}
          >
            <Camera size={20} className="text-white" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full border-4 border-cyber-dark overflow-hidden bg-gradient-to-br from-cyber-purple to-cyber-pink">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {profile.verified && (
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-cyber-dark flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-cyber-cyan flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-cyber-dark"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 pb-2 gap-3">
          {!isOwnProfile && (
            <>
              <FollowButton
                userId={userId}
                isFollowing={isFollowing}
                onFollowChange={handleFollowChange}
                variant="primary"
                size="md"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMessage}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'bg-cyber-dark border border-cyber-purple/20',
                  'text-cyber-purple hover:bg-cyber-purple/10',
                  'transition-all duration-300'
                )}
              >
                <Mail size={18} />
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-lg',
              'bg-cyber-dark border border-cyber-purple/20',
              'text-cyber-purple hover:bg-cyber-purple/10',
              'transition-all duration-300'
            )}
          >
            <Share2 size={18} />
          </motion.button>

          {isOwnProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className={cn(
                'px-4 py-2 rounded-lg',
                'bg-cyber-purple/10 border border-cyber-purple/20',
                'text-cyber-purple hover:bg-cyber-purple/20',
                'transition-all duration-300 flex items-center gap-2'
              )}
            >
              <Settings size={18} />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </div>

        {/* Name & Bio */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              {profile.displayName}
            </h1>
            {profile.verified && (
              <div className="w-5 h-5 rounded-full bg-cyber-cyan flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-cyber-dark"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <p className="text-cyber-muted">@{profile.username}</p>

          {profile.bio && (
            <p className="mt-4 text-white/90 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-cyber-muted">
          {profile.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{profile.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Joined {formatDate(profile.joinedAt)}</span>
          </div>

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cyber-cyan transition-colors"
            >
              <LinkIcon size={16} />
              <span className="underline">{profile.website}</span>
            </a>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 pb-6">
        <SocialStatsCard
          userId={userId}
          username={profile.username}
          variant="compact"
          className="border-0 bg-transparent p-0"
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
