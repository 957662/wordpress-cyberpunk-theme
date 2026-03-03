import { FollowersList } from '@/components/follow';
import { Metadata } from 'next';

interface FollowingPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: FollowingPageProps): Promise<Metadata> {
  return {
    title: `${params.username} 的关注列表`,
    description: `查看 ${params.username} 关注的所有用户`,
  };
}

export default function FollowingPage({ params }: FollowingPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <FollowersList userId={0} type="following" />
    </div>
  );
}
