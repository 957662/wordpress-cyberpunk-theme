'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Fork,
  Eye,
  GitFork,
  Circle,
  Lock,
  Unlock,
  Calendar,
  User
} from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  languageColor?: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  private: boolean;
  created_at: string;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
    type: string;
  };
  license?: {
    name: string;
  } | null;
}

interface GitHubRepoCardProps {
  repo: GitHubRepo;
  showOwner?: boolean;
  showStats?: boolean;
  showTopics?: boolean;
  onStar?: () => void;
  onFork?: () => void;
  className?: string;
}

export default function GitHubRepoCard({
  repo,
  showOwner = true,
  showStats = true,
  showTopics = true,
  onStar,
  onFork,
  className = ''
}: GitHubRepoCardProps) {
  const [languageColor, setLanguageColor] = useState<string>('');

  useEffect(() => {
    // 获取语言颜色（可以通过API获取，这里使用预设颜色）
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      Go: '#00ADD8',
      Rust: '#dea584',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
    };

    if (repo.language) {
      setLanguageColor(colors[repo.language] || '#8b949e');
    }
  }, [repo.language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-5 hover:border-cyber-cyan/40 transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {repo.private ? (
            <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          ) : (
            <Unlock className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-cyber-cyan hover:underline truncate">
              <a
                href={`https://github.com/${repo.full_name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
            </h3>

            {showOwner && repo.owner && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                {repo.owner.login}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {repo.description}
        </p>
      )}

      {/* Topics */}
      {showTopics && repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.slice(0, 5).map((topic) => (
            <a
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded-full hover:bg-cyber-cyan/20 transition-colors"
            >
              {topic}
            </a>
          ))}
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <Circle
                className="w-3 h-3"
                style={{ color: languageColor }}
                fill="currentColor"
              />
              <span>{repo.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4" />
            <span>{formatNumber(repo.stargazers_count)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <GitFork className="w-4 h-4" />
            <span>{formatNumber(repo.forks_count)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(repo.watchers_count)}</span>
          </div>

          {repo.license && (
            <span className="text-xs px-2 py-1 bg-gray-800 rounded">
              {repo.license.name}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(repo.updated_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onStar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStar}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/20 transition-colors"
            >
              <Star className="w-3 h-3" />
              Star
            </motion.button>
          )}

          {onFork && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFork}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-cyber-purple/10 text-cyber-purple rounded-lg hover:bg-cyber-purple/20 transition-colors"
            >
              <GitFork className="w-3 h-3" />
              Fork
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 组件：GitHub 仓库列表
export function GitHubRepoList({
  repos,
  ...props
}: Omit<GitHubRepoCardProps, 'repo'> & { repos: GitHubRepo[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <GitHubRepoCard key={repo.id} repo={repo} {...props} />
      ))}
    </div>
  );
}

// Hook: 获取 GitHub 仓库数据
export function useGitHubRepos(username: string) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  return { repos, loading, error };
}
