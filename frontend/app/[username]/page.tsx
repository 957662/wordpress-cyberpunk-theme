'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { username } = params;

  try {
    // Fetch user data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${username}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return {
        title: 'User Not Found',
      };
    }

    const user = await response.json();

    return {
      title: `${user.full_name || user.username} - CyberPress`,
      description: user.bio || `Profile of ${user.username}`,
      openGraph: {
        title: user.full_name || user.username,
        description: user.bio,
        images: user.avatar_url ? [user.avatar_url] : [],
      },
    };
  } catch {
    return {
      title: 'User Profile',
    };
  }
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = params;

  try {
    // Fetch user data
    const [userResponse, postsResponse] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${username}`,
        { cache: 'no-store' }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts?author=${username}`,
        { cache: 'no-store' }
      ),
    ]);

    if (!userResponse.ok) {
      notFound();
    }

    const user = await userResponse.json();
    const posts = postsResponse.ok ? await postsResponse.json() : [];

    return (
      <div className="min-h-screen bg-cyber-dark">
        {/* Profile Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20" />
          <div className="relative max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-4 border-cyber-cyan object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center text-4xl font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-cyber-dark" />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user.full_name || user.username}
                </h1>
                {user.bio && (
                  <p className="text-gray-300 text-lg mb-4">{user.bio}</p>
                )}

                {/* Stats */}
                <div className="flex gap-6 text-gray-400">
                  <div>
                    <span className="text-cyber-cyan font-semibold">
                      {posts.length || 0}
                    </span>{' '}
                    Posts
                  </div>
                  <div>
                    <span className="text-cyber-cyan font-semibold">
                      {user.followers_count || 0}
                    </span>{' '}
                    Followers
                  </div>
                  <div>
                    <span className="text-cyber-cyan font-semibold">
                      {user.following_count || 0}
                    </span>{' '}
                    Following
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href={`/settings/profile`}
                  className="px-6 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-semibold hover:bg-cyber-cyan/80 transition-colors"
                >
                  Edit Profile
                </Link>
                <button className="px-6 py-2 border border-cyber-purple text-cyber-purple rounded-lg font-semibold hover:bg-cyber-purple/10 transition-colors">
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Posts</h2>

          {posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block p-6 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-cyber-cyan mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>{post.view_count} views</span>
                    <span>{post.comments_count} comments</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading user profile:', error);
    notFound();
  }
}
