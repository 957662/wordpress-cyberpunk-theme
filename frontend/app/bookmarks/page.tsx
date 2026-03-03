/**
 * Bookmarks Page
 * Displays user's bookmarked posts and comments
 */

import React from 'react';
import { Metadata } from 'next';
import { Bookmark, FolderOpen } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import BookmarkClient from './client-page';

export const metadata: Metadata = {
  title: '我的收藏 - CyberPress',
  description: '查看您收藏的文章和评论',
};

async function getBookmarks(userId: string) {
  const bookmarks = await db.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      folder: true,
      post: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      },
      comment: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookmarks;
}

async function getFolders(userId: string) {
  const folders = await db.bookmarkFolder.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          bookmarks: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return folders;
}

export default async function BookmarksPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth/login?redirect=/bookmarks');
  }

  const [bookmarks, folders] = await Promise.all([
    getBookmarks(session.user.id),
    getFolders(session.user.id),
  ]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
              <Bookmark size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyber-text-primary">我的收藏</h1>
              <p className="text-sm text-cyber-text-secondary">
                {bookmarks.length} 项收藏 · {folders.length} 个收藏夹
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <BookmarkClient
          initialBookmarks={JSON.parse(JSON.stringify(bookmarks))}
          initialFolders={JSON.parse(JSON.stringify(folders))}
        />
      </div>
    </div>
  );
}
