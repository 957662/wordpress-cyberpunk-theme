'use client';

import React from 'react';
import { GitHub, Star, Fork, Issue, Repo } from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  open_issues: number;
}

interface GitHubIntegrationProps {
  username: string;
  repos?: GitHubRepo[];
  className?: string;
}

export default function GitHubIntegration({
  username,
  repos = [],
  className = '',
}: GitHubIntegrationProps) {
  if (repos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <GitHub className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No repositories found</p>
      </div>
    );
  }

  return (
    <div className={`github-integration ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <GitHub className="w-6 h-6 text-white" />
        <h3 className="text-xl font-bold text-white">
          @{username}'s Repositories
        </h3>
      </div>

      <div className="grid gap-4">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Repo className="w-5 h-5 text-cyber-cyan" />
                <h4 className="text-lg font-semibold text-white">{repo.name}</h4>
              </div>
              {repo.language && (
                <span className="px-2 py-1 text-xs bg-cyber-purple/20 text-cyber-purple rounded">
                  {repo.language}
                </span>
              )}
            </div>

            {repo.description && (
              <p className="text-gray-400 text-sm mb-3">{repo.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Fork className="w-4 h-4" />
                <span>{repo.forks}</span>
              </div>
              {repo.open_issues > 0 && (
                <div className="flex items-center gap-1">
                  <Issue className="w-4 h-4" />
                  <span>{repo.open_issues}</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
