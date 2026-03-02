import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PortfolioDetail } from '@/components/portfolio/PortfolioDetail';
import { ProjectGrid } from '@/components/portfolio/ProjectGrid';
import { LoadingState } from '@/components/ui/LoadingState';
import { CyberGrid } from '@/components/effects/CyberGrid';
import { Scanlines } from '@/components/effects/ScanLines';
import { HolographicEffect } from '@/components/effects/HolographicEffect';

interface PortfolioProjectPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PortfolioProjectPageProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/portfolio?slug=${params.slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return {
        title: 'Project Not Found | CyberPress',
      };
    }

    const projects = await response.json();

    if (!projects || projects.length === 0) {
      return {
        title: 'Project Not Found | CyberPress',
      };
    }

    const project = projects[0];

    return {
      title: `${project.title.rendered} | CyberPress Portfolio`,
      description: project.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      openGraph: {
        title: project.title.rendered,
        description: project.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
        type: 'article',
        images: project.acf?.project_gallery?.map((img: any) => img.url) || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title.rendered,
        description: project.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Portfolio Project | CyberPress',
    };
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/portfolio?per_page=100&_fields=slug`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return [];
    }

    const projects = await response.json();

    return projects.map((project: { slug: string }) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid className="fixed inset-0 opacity-20 pointer-events-none" />
      <Scanlines className="fixed inset-0 opacity-10 pointer-events-none" />
      <HolographicEffect className="fixed inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Project Detail */}
        <article className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingState type="skeleton" count={1} />}>
            <PortfolioDetail slug={params.slug} />
          </Suspense>
        </article>

        {/* Related Projects */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Related Projects</h2>
          <Suspense fallback={<LoadingState type="card" count={3} />}>
            <ProjectGrid
              excludeSlug={params.slug}
              limit={3}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;
