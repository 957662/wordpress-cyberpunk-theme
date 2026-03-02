import { Metadata } from 'next';
import { CyberGrid } from '@/components/effects/CyberGrid';
import { Scanlines } from '@/components/effects/ScanLines';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { GlitchText } from '@/components/effects/GlitchText';
import { NeonCard } from '@/components/ui/NeonCard';
import { ContactForm } from '@/components/ui/ContactForm';
import { SocialIcons } from '@/components/graphics/SocialIcons';

export const metadata: Metadata = {
  title: 'Contact | CyberPress Platform',
  description: 'Get in touch with the CyberPress team for your next project',
  keywords: ['contact', 'get in touch', 'hire', 'collaborate'],
};

export default function ContactPage() {
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
              text="Get in Touch"
              className="text-6xl md:text-8xl font-bold mb-6"
            />
            <p className="text-xl md:text-2xl text-cyber-cyan/80 max-w-3xl mx-auto">
              Ready to start your next project? Let's create something extraordinary together.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <NeonCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Send a Message</h2>
                <ContactForm />
              </NeonCard>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Email */}
              <NeonCard className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyber-primary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyber-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-cyber-primary">Email</h3>
                    <a href="mailto:hello@cyberpress.dev" className="text-gray-300 hover:text-cyber-cyan transition-colors">
                      hello@cyberpress.dev
                    </a>
                  </div>
                </div>
              </NeonCard>

              {/* Location */}
              <NeonCard className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyber-secondary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyber-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-cyber-secondary">Location</h3>
                    <p className="text-gray-300">
                      Digital Nomad<br />
                      Working Worldwide
                    </p>
                  </div>
                </div>
              </NeonCard>

              {/* Response Time */}
              <NeonCard className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyber-accent/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyber-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-cyber-accent">Response Time</h3>
                    <p className="text-gray-300">
                      Usually within 24 hours<br />
                      Monday - Friday
                    </p>
                  </div>
                </div>
              </NeonCard>

              {/* Social Links */}
              <NeonCard className="p-6">
                <h3 className="font-semibold mb-4 gradient-text">Follow Us</h3>
                <SocialIcons className="justify-start" />
              </NeonCard>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="container mx-auto px-4 py-12">
          <NeonCard className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-center gradient-text">Working Across the Globe</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-cyber-card rounded-lg">
                <div className="text-3xl mb-2">🇺🇸</div>
                <div className="text-sm text-gray-400">North America</div>
              </div>
              <div className="text-center p-4 bg-cyber-card rounded-lg">
                <div className="text-3xl mb-2">🇬🇧</div>
                <div className="text-sm text-gray-400">Europe</div>
              </div>
              <div className="text-center p-4 bg-cyber-card rounded-lg">
                <div className="text-3xl mb-2">🇯🇵</div>
                <div className="text-sm text-gray-400">Asia</div>
              </div>
              <div className="text-center p-4 bg-cyber-card rounded-lg">
                <div className="text-3xl mb-2">🌏</div>
                <div className="text-sm text-gray-400">Australia</div>
              </div>
            </div>
          </NeonCard>
        </section>
      </div>
    </main>
  );
}
