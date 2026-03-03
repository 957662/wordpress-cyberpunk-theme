import { FollowersList } from '@/components/follow';
import { Metadata } from 'next';

interface FollowersPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: FollowersPageProps): Promise<Metadata> {
  return {
    title: `${params.username} 的粉丝列表`,
    description: `查看 ${params.username} 的所有粉丝`,
  };
}

export default function FollowersPage({ params }: FollowersPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <FollowersList userId={0} type="followers" />
    </div>
  );
}
