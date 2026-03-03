/**
 * 用户关注列表页面
 * 显示指定用户关注的所有用户
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FollowingList from '@/components/follow/FollowingList';

interface PageProps {
  params: {
    username: string;
  };
  searchParams: {
    page?: string;
  };
}

/**
 * 生成页面元数据
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = params;

  return {
    title: `${username} 关注的用户 - CyberPress`,
    description: `查看 ${username} 关注的所有用户`,
    openGraph: {
      title: `${username} 关注的用户`,
      type: 'website',
    },
  };
}

/**
 * 关注列表页面
 */
export default async function FollowingPage({
  params,
  searchParams,
}: PageProps) {
  const { username } = params;
  const page = parseInt(searchParams.page || '1', 10);

  // 这里应该从 API 获取用户信息
  // 暂时使用模拟数据
  const user = {
    id: '1',
    username,
    displayName: username,
    avatar: '',
    followingCount: 0,
  };

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 border-b border-cyber-cyan/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-16 h-16 rounded-full border-2 border-cyber-cyan"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-cyber-cyan font-orbitron">
                {user.displayName}
              </h1>
              <p className="text-cyber-purple">@{user.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 关注列表 */}
      <div className="container mx-auto px-4 py-8">
        <FollowingList username={username} initialPage={page} />
      </div>
    </div>
  );
}
