/**
 * GitHub 个人资料集成组件
 * 显示 GitHub 用户信息和活动
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Users, Repo, Star, GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GitHubProfileProps {
  username: string;
  className?: string;
  showStats?: boolean;
  showRepos?: boolean;
  repoCount?: number;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  topics: string[];
}

/**
 * GitHub 个人资料组件
 */
export function GitHubProfile({
  username,
  className,
  showStats = true,
  showRepos = true,
  repoCount = 6
}: GitHubProfileProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 获取用户信息
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error('User not found');
        }
        const userData: GitHubUser = await userResponse.json();
        setUser(userData);

        // 获取仓库信息
        if (showRepos) {
          const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=${repoCount}`
          );
          if (reposResponse.ok) {
            const reposData: GitHubRepo[] = await reposResponse.json();
            setRepos(reposData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username, showRepos, repoCount]);

  if (loading) {
    return (
      <div className={cn('cyber-card p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-cyber-cyan/20" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-cyber-purple/20" />
              <div className="h-3 w-24 rounded bg-cyber-muted/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={cn('cyber-card p-6', className)}>
        <div className="text-center text-red-400">
          <Github className="mx-auto mb-2 h-12 w-12" />
          <p>{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('cyber-card p-6 space-y-6', className)}
    >
      {/* 用户信息 */}
      <div className="flex items-start space-x-4">
        <motion.a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0"
        >
          <img
            src={user.avatar_url}
            alt={user.name || user.login}
            className="h-16 w-16 rounded-full ring-2 ring-cyber-cyan ring-offset-2 ring-offset-background"
          />
        </motion.a>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-cyber-cyan flex items-center gap-2">
            {user.name || user.login}
            <Github className="h-5 w-5" />
          </h3>
          {user.bio && (
            <p className="mt-1 text-sm text-gray-400 line-clamp-2">{user.bio}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {user.location && (
              <span className="flex items-center gap-1">📍 {user.location}</span>
            )}
            {user.blog && (
              <a
                href={user.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyber-cyan transition-colors"
              >
                🔗 {user.blog}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      {showStats && (
        <div className="grid grid-cols-3 gap-4">
          <StatItem
            icon={<Repo className="h-4 w-4" />}
            label="Repositories"
            value={user.public_repos}
          />
          <StatItem
            icon={<Users className="h-4 w-4" />}
            label="Followers"
            value={user.followers}
          />
          <StatItem
            icon={<Github className="h-4 w-4" />}
            label="Following"
            value={user.following}
          />
        </div>
      )}

      {/* 热门仓库 */}
      {showRepos && repos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyber-purple">Popular Repositories</h4>
          <div className="space-y-2">
            {repos.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="cyber-badge p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-cyber-cyan mb-1">
        {icon}
        <span className="text-lg font-bold">{value}</span>
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

interface RepositoryCardProps {
  repo: GitHubRepo;
}

function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 4 }}
      className="block p-3 rounded-lg border border-cyber-muted/30 hover:border-cyber-cyan/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-cyber-cyan hover:text-cyber-purple transition-colors">
            {repo.name}
          </h5>
          {repo.description && (
            <p className="mt-1 text-xs text-gray-400 line-clamp-2">{repo.description}</p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyber-pink" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repo.forks_count}
        </span>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs rounded-full bg-cyber-muted/30 text-cyber-cyan"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
