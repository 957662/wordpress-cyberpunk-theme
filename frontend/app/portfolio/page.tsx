import { Metadata } from 'next';
import { Suspense } from 'react';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { LoadingState } from '@/components/ui/LoadingState';
import { CyberGrid } from '@/components/effects/CyberGrid';
import { Scanlines } from '@/components/effects/ScanLines';
import { ParticleBackground } from '@/components/effects/ParticleBackground';

export const metadata: Metadata = {
  title: 'Portfolio | CyberPress Platform',
  description: 'Showcase of innovative projects and creative works from the digital realm',
  keywords: ['portfolio', 'projects', 'showcase', 'work', 'creative'],
};

export default function PortfolioPage({
  searchParams,
}: {
  searchParams: { category?: string; skill?: string; page?: string };
}) {
  const category = searchParams.category;
  const skill = searchParams.skill;
  const page = parseInt(searchParams.page || '1');

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid className="fixed inset-0 opacity-20 pointer-events-none" />
      <Scanlines className="fixed inset-0 opacity-10 pointer-events-none" />
      <ParticleBackground className="fixed inset-0 opacity-30 pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text animate-fade-in">
              Portfolio
            </h1>
            <p className="text-xl md:text-2xl text-cyber-cyan/80 max-w-3xl mx-auto mb-8">
              Exploring the intersection of creativity and technology
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded-full text-cyber-primary text-sm">
                Web Development
              </span>
              <span className="px-4 py-2 bg-cyber-secondary/10 border border-cyber-secondary/30 rounded-full text-cyber-secondary text-sm">
                Mobile Apps
              </span>
              <span className="px-4 py-2 bg-cyber-accent/10 border border-cyber-accent/30 rounded-full text-cyber-accent text-sm">
                UI/UX Design
              </span>
              <span className="px-4 py-2 bg-cyber-warning/10 border border-cyber-warning/30 rounded-full text-cyber-warning text-sm">
                Blockchain
              </span>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="container mx-auto px-4 py-12">
          <Suspense fallback={<LoadingState type="card" count={6} />}>
            <PortfolioGrid
              category={category}
              skill={skill}
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
