'use client';

import React from 'react';
import {
  EmailTemplate,
  EmailButton,
  EmailSection,
  EmailHeading,
  EmailText,
  EmailDivider
} from './EmailTemplate';

interface DigestItem {
  title: string;
  excerpt: string;
  author: string;
  url: string;
  publishedAt: string;
  readTime?: string;
}

interface DigestEmailProps {
  recipientName: string;
  digestType: 'daily' | 'weekly';
  dateRange: string;
  topPosts: DigestItem[];
  trendingTopics?: string[];
  stats?: {
    totalPosts: number;
    totalComments: number;
    newUsers: number;
  };
}

/**
 * 摘要邮件模板
 * 用于每日/每周内容摘要
 */
export const DigestEmail: React.FC<DigestEmailProps> = ({
  recipientName,
  digestType,
  dateRange,
  topPosts,
  trendingTopics,
  stats
}) => {
  return (
    <EmailTemplate
      subject={`Your ${digestType} CyberPress Digest`}
      previewText={`Top stories and updates from ${dateRange}`}
    >
      <EmailSection>
        <EmailHeading level={1}>
          {digestType === 'daily' ? 'Daily' : 'Weekly'} Digest 📰
        </EmailHeading>
        <EmailText>
          Hi {recipientName}, here's what you missed on CyberPress{' '}
          {digestType === 'daily' ? 'today' : 'this week'}.
        </EmailText>
      </EmailSection>

      <EmailDivider />

      {/* Stats Section */}
      {stats && (
        <>
          <EmailSection>
            <EmailHeading level={2}>Platform Activity</EmailHeading>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-cyber-muted/50 rounded-lg border border-cyber-cyan/20">
                <div className="text-2xl font-bold text-cyber-cyan">
                  {stats.totalPosts}
                </div>
                <div className="text-sm text-cyber-cyan/60">New Posts</div>
              </div>
              <div className="text-center p-4 bg-cyber-muted/50 rounded-lg border border-cyber-cyan/20">
                <div className="text-2xl font-bold text-cyber-purple">
                  {stats.totalComments}
                </div>
                <div className="text-sm text-cyber-cyan/60">Comments</div>
              </div>
              <div className="text-center p-4 bg-cyber-muted/50 rounded-lg border border-cyber-cyan/20">
                <div className="text-2xl font-bold text-cyber-pink">
                  {stats.newUsers}
                </div>
                <div className="text-sm text-cyber-cyan/60">New Users</div>
              </div>
            </div>
          </EmailSection>

          <EmailDivider />
        </>
      )}

      {/* Top Posts */}
      <EmailSection>
        <EmailHeading level={2}>Top Posts 📈</EmailHeading>
        <div className="space-y-6">
          {topPosts.map((post, index) => (
            <div
              key={index}
              className="border-l-4 border-cyber-cyan/30 pl-4 hover:border-cyber-cyan transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                  <span className="text-cyber-cyan font-bold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <a
                    href={post.url}
                    className="text-lg font-semibold text-white hover:text-cyber-cyan transition-colors"
                  >
                    {post.title}
                  </a>
                  <p className="text-sm text-cyber-cyan/60 mt-1">
                    by {post.author} • {post.publishedAt}
                    {post.readTime && ` • ${post.readTime} read`}
                  </p>
                  <p className="text-cyber-cyan/80 mt-2 text-sm">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </EmailSection>

      <EmailDivider />

      {/* Trending Topics */}
      {trendingTopics && trendingTopics.length > 0 && (
        <>
          <EmailSection>
            <EmailHeading level={2}>Trending Topics 🔥</EmailHeading>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <a
                  key={index}
                  href={`/tags/${topic.toLowerCase()}`}
                  className="inline-block px-4 py-2 rounded-full bg-cyber-muted/50 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors text-sm"
                >
                  #{topic}
                </a>
              ))}
            </div>
          </EmailSection>

          <EmailDivider />
        </>
      )}

      {/* CTA */}
      <EmailSection>
        <EmailText>
          Want to see more? Click the button below to explore all the latest
          content on CyberPress.
        </EmailText>
        <div className="text-center my-8">
          <EmailButton href="/explore" variant="primary">
            Explore More Posts
          </EmailButton>
        </div>
      </EmailSection>

      <EmailSection>
        <EmailText className="text-sm">
          You're receiving this {digestType} digest because you subscribed to
          updates from CyberPress Platform.
        </EmailText>
        <EmailText className="text-sm">
          <a
            href="/settings/notifications"
            className="text-cyber-cyan hover:underline"
          >
            Manage your subscription preferences
          </a>
          .
        </EmailText>
      </EmailSection>
    </EmailTemplate>
  );
};

export default DigestEmail;
