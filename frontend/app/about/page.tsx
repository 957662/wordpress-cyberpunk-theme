import { Metadata } from 'next';
import { Suspense } from 'react';
import { CyberGrid } from '@/components/effects/CyberGrid';
import { Scanlines } from '@/components/effects/ScanLines';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { GlitchText } from '@/components/effects/GlitchText';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { NeonCard } from '@/components/ui/NeonCard';
import { SocialIcons } from '@/components/graphics/SocialIcons';
import { LoadingState } from '@/components/ui/LoadingState';

export const metadata: Metadata = {
  title: 'About | CyberPress Platform',
  description: 'Learn more about CyberPress and our mission to push the boundaries of web development',
  keywords: ['about', 'cyberpress', 'mission', 'team', 'story'],
};

async function getAboutData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/pages?slug=about`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return null;
    }

    const pages = await response.json();
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

async function getTeamMembers() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/team?per_page=10`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export default async function AboutPage() {
  const [aboutData, teamMembers] = await Promise.all([
    getAboutData(),
    getTeamMembers(),
  ]);

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
            <GlitchText
              text="About Us"
              className="text-6xl md:text-8xl font-bold mb-6"
            />
            <div className="max-w-3xl mx-auto">
              <TypewriterText
                text="Pushing the boundaries of web development with cutting-edge technology and innovative design"
                className="text-xl md:text-2xl text-cyber-cyan/80"
                speed={30}
              />
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <NeonCard className="p-8">
              <h3 className="text-3xl font-bold mb-4 gradient-text">Our Mission</h3>
              <div className="prose prose-invert max-w-none">
                {aboutData?.content?.rendered ? (
                  <div dangerouslySetInnerHTML={{ __html: aboutData.content.rendered }} />
                ) : (
                  <p className="text-gray-300">
                    We are dedicated to creating exceptional digital experiences that combine
                    cutting-edge technology with stunning design. Our mission is to push the
                    boundaries of what's possible on the web, delivering solutions that are
                    not just functional, but truly extraordinary.
                  </p>
                )}
              </div>
            </NeonCard>

            {/* Vision */}
            <NeonCard className="p-8">
              <h3 className="text-3xl font-bold mb-4 gradient-text">Our Vision</h3>
              <p className="text-gray-300 mb-4">
                We envision a future where technology seamlessly integrates with creativity,
                where websites are not just information repositories but immersive experiences.
                We strive to be at the forefront of this digital revolution.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyber-cyan mb-2">50+</div>
                  <div className="text-sm text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyber-purple mb-2">100%</div>
                  <div className="text-sm text-gray-400">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyber-accent mb-2">5+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyber-warning mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </NeonCard>
          </div>

          {/* Tech Stack */}
          <NeonCard className="p-8 mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center gradient-text">Tech Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: 'Next.js', color: 'text-cyber-cyan' },
                { name: 'TypeScript', color: 'text-cyber-blue' },
                { name: 'React', color: 'text-cyber-primary' },
                { name: 'Tailwind', color: 'text-cyber-teal' },
                { name: 'Node.js', color: 'text-cyber-green' },
                { name: 'WordPress', color: 'text-cyber-indigo' },
                { name: 'GraphQL', color: 'text-cyber-pink' },
                { name: 'Docker', color: 'text-cyber-purple' },
                { name: 'AWS', color: 'text-cyber-orange' },
                { name: 'Redis', color: 'text-cyber-red' },
                { name: 'PostgreSQL', color: 'text-cyber-blue' },
                { name: 'Figma', color: 'text-cyber-pink' },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center justify-center p-4 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-cyan/50 transition-all duration-300"
                >
                  <span className={`text-lg font-semibold ${tech.color}`}>{tech.name}</span>
                </div>
              ))}
            </div>
          </NeonCard>

          {/* Team Section */}
          {teamMembers.length > 0 && (
            <section className="mb-16">
              <h3 className="text-3xl font-bold mb-8 text-center gradient-text">Meet the Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member: any) => (
                  <NeonCard key={member.id} className="p-6">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-3xl font-bold">
                        {member.title?.rendered?.[0] || '?'}
                      </div>
                      <h4 className="text-xl font-bold mb-2">{member.title?.rendered}</h4>
                      <p className="text-cyber-cyan/80 mb-4">
                        {member.acf?.role || 'Team Member'}
                      </p>
                      <div
                        className="prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: member.excerpt?.rendered || '' }}
                      />
                    </div>
                  </NeonCard>
                ))}
              </div>
            </section>
          )}

          {/* Contact CTA */}
          <NeonCard className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4 gradient-text">Let's Work Together</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have a project in mind? We'd love to hear about it. Get in touch and let's create
              something amazing together.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-cyber-primary text-background font-semibold rounded-lg hover:bg-cyber-cyan/80 transition-all duration-300"
            >
              Get in Touch
            </a>

            {/* Social Links */}
            <div className="mt-8">
              <SocialIcons className="justify-center" />
            </div>
          </NeonCard>
        </section>
      </div>
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;
