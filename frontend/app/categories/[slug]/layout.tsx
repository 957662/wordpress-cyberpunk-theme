/**
 * Category Page Layout
 * 分类页面布局
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const categories: Record<string, { name: string; description: string }> = {
  tech: {
    name: '技术',
    description: '探索前沿技术、编程技巧和开发经验',
  },
  design: {
    name: '设计',
    description: 'UI/UX 设计、视觉创意和设计趋势',
  },
  tutorial: {
    name: '教程',
    description: '实战教程、学习指南和最佳实践',
  },
  thoughts: {
    name: '随笔',
    description: '个人思考、行业观察和经验分享',
  },
};

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) {
    return {
      title: '分类不存在',
    };
  }

  return {
    title: `${category.name} - CyberPress`,
    description: category.description,
  };
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) {
    notFound();
  }

  return <>{children}</>;
}
