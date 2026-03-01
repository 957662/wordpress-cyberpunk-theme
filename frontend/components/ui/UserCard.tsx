'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';

interface UserCardProps {
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  followersCount?: number;
  followingCount?: number;
  isCurrentUser?: boolean;
  onEdit?: () => void;
  className?: string;
}

export function UserCard({
  username,
  displayName,
  bio,
  avatar,
  location,
  website,
  joinedDate,
  followersCount,
  followingCount,
  isCurrentUser = false,
  onEdit,
  className = '',
}: UserCardProps) {
  return (
    <div className={`bg-gray-900/50 border border-cyan-500/20 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1 flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-cyan-100 truncate">
                {displayName}
              </h3>
              <p className="text-cyan-600 text-sm">@{username}</p>
            </div>

            {isCurrentUser && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg text-sm font-semibold hover:bg-cyan-400/30 transition-colors flex-shrink-0"
              >
                Edit Profile
              </button>
            )}
          </div>

          {bio && (
            <p className="text-cyan-300/80 text-sm mt-3 line-clamp-2">{bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-cyan-600">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
            )}

            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
              >
                <LinkIcon size={14} />
                <span className="truncate max-w-[150px]">{website}</span>
              </a>
            )}

            {joinedDate && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Joined {joinedDate}</span>
              </div>
            )}
          </div>

          <div className="flex gap-6 mt-4">
            {followersCount !== undefined && (
              <Link
                href={`/users/${username}/followers`}
                className="text-sm"
              >
                <span className="text-cyan-100 font-bold">{followersCount}</span>
                <span className="text-cyan-600 ml-1">Followers</span>
              </Link>
            )}

            {followingCount !== undefined && (
              <Link
                href={`/users/${username}/following`}
                className="text-sm"
              >
                <span className="text-cyan-100 font-bold">{followingCount}</span>
                <span className="text-cyan-600 ml-1">Following</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
