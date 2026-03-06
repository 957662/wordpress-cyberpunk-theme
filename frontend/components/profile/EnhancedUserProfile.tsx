'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  User,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit,
  Settings,
  Share2,
  Trophy,
  FileText,
  Heart,
  Bookmark,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
  achievements?: Achievement[];
  badges?: Badge[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface EnhancedUserProfileProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  className?: string;
}

export function EnhancedUserProfile({
  profile,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onMessage,
  onShare,
  className,
}: EnhancedUserProfileProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'bookmarks'>('posts');

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
      case 'rare':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'epic':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'legendary':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Cover & Avatar Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20 rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/hologram.svg')] opacity-30" />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-16 left-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full border-4 border-cyber-dark bg-cyber-dark overflow-hidden">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.displayName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cyber-cyan/20">
                  <User className="w-16 h-16 text-cyber-cyan" />
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 p-2 bg-cyber-cyan rounded-full text-cyber-dark hover:bg-cyber-cyan/80 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
          {!isOwnProfile && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isFollowing ? onUnfollow : onFollow}
                className={cn(
                  'px-6 py-2 rounded-lg font-semibold transition-colors',
                  isFollowing
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80'
                )}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMessage}
                className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </motion.button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          {isOwnProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-6">
        <div className="space-y-4">
          {/* Name & Username */}
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
            <p className="text-gray-400">@{profile.username}</p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-300">{profile.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
            </div>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyber-cyan hover:underline"
              >
                <LinkIcon className="w-4 h-4" />
                <span>{profile.website}</span>
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-800">
            <StatItem icon={<FileText className="w-5 h-5" />} value={profile.stats.posts} label="Posts" />
            <StatItem icon={<User className="w-5 h-5" />} value={profile.stats.followers} label="Followers" />
            <StatItem icon={<Heart className="w-5 h-5" />} value={profile.stats.likes} label="Likes" />
            <StatItem icon={<Bookmark className="w-5 h-5" />} value={profile.stats.following} label="Following" />
          </div>

          {/* Achievements */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{achievement.title}</p>
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          {profile.badges && profile.badges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border-2 bg-gradient-to-br',
                      getRarityColor(badge.rarity)
                    )}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-white capitalize">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-cyber-cyan mb-1">
        {icon}
      </div>
      <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
