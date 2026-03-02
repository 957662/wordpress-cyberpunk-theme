import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { BlogHero } from '@/components/blog/BlogHero';
import { CategoryList } from '@/components/blog/CategoryList';
import { LoadingState } from '@/components/ui/LoadingState';
import { CyberGrid } from '@/components/effects/CyberGrid';

export const metadata: Metadata = {
  title: 'Blog | CyberPress Platform',
  description: 'Explore the latest insights, tutorials, and stories from the digital frontier',
  keywords: ['blog', 'articles', 'tutorials', 'cyberpunk', 'technology'],
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; search?: string; page?: string };
}) {
  const category = searchParams.category;
  const tag = searchParams.tag;
  const search = searchParams.search;
  const page = parseInt(searchParams.page || '1');

  return (
    <main className="min-h-screen relative">
      {/* Background Effects */}
      <CyberGrid className="fixed inset-0 opacity-30 pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <BlogHero />

        {/* Categories */}
        <section className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingState type="skeleton" count={5} />}>
            <CategoryList
              selectedCategory={category}
              selectedTag={tag}
            />
          </Suspense>
        </section>

        {/* Blog Posts */}
        <section className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingState type="card" count={6} />}>
            <BlogList
              category={category}
              tag={tag}
              search={search}
              page={page}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

// Generate static params for static generation
export async function generateStaticParams() {
  return [{ page: '1' }, { page: '2' }, { page: '3' }];
}

// Revalidate every 60 seconds
export const revalidate = 60;
