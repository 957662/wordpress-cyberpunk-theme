'use client';

import { NewsletterSection } from '@/components/newsletter/NewsletterSection';
import { NewsletterWidget } from '@/components/newsletter/NewsletterWidget';
import { useState } from 'react';

export default function NewsletterExamplePage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Newsletter Components Demo
          </h1>
          <p className="text-gray-400 mt-2">
            Explore the newsletter subscription components
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Newsletter Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Newsletter Section</h2>
            <p className="text-gray-400">
              A full-featured newsletter subscription section with tag selection
            </p>
          </div>

          <NewsletterSection
            title="Stay Updated with the Latest News"
            description="Subscribe to our newsletter and never miss an update. Get the latest articles, tutorials, and resources delivered straight to your inbox."
            tags={['Technology', 'Design', 'Development', 'AI', 'DevOps', 'Security']}
            showTags={true}
          />
        </section>

        {/* Newsletter Widgets */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Newsletter Widget</h2>
            <p className="text-gray-400">
              Compact newsletter widgets for sidebars and footers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vertical Widget */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Vertical Widget</h3>
              <NewsletterWidget
                orientation="vertical"
                title="Weekly Digest"
                description="Get a weekly summary of our best content"
              />
            </div>

            {/* Horizontal Widget */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Horizontal Widget</h3>
              <NewsletterWidget
                orientation="horizontal"
                title="Quick Subscribe"
                description="Stay in the loop"
              />
            </div>
          </div>
        </section>

        {/* Compact Widget */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Compact Widget</h2>
            <p className="text-gray-400">
              Minimal newsletter widget for tight spaces
            </p>
          </div>

          <div className="max-w-md">
            <NewsletterWidget compact />
          </div>
        </section>

        {/* Popup Demo */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Newsletter Popup</h2>
            <p className="text-gray-400">
              A modal popup that appears after a delay (click to preview)
            </p>
          </div>

          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Show Newsletter Popup
          </button>

          {showPopup && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-8 max-w-md">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Newsletter Popup Demo
                </h3>
                <p className="text-gray-300 mb-6">
                  This is how the popup would look. In production, it would appear automatically after a delay.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Usage Examples */}
        <section className="border-t border-cyan-500/20 pt-12">
          <h2 className="text-2xl font-bold text-white mb-8">Usage Examples</h2>

          <div className="space-y-8">
            {/* Example 1 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Usage</h3>
              <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
{`import { NewsletterSection } from '@/components/newsletter/NewsletterSection';

function MyComponent() {
  return (
    <NewsletterSection
      title="Subscribe to Our Newsletter"
      description="Get the latest posts delivered right to your inbox"
    />
  );
}`}
                </code>
              </pre>
            </div>

            {/* Example 2 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">With Tags</h3>
              <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
{`import { NewsletterSection } from '@/components/newsletter/NewsletterSection';

function MyComponent() {
  return (
    <NewsletterSection
      showTags={true}
      tags={['Technology', 'Design', 'Development']}
    />
  );
}`}
                </code>
              </pre>
            </div>

            {/* Example 3 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Widget in Sidebar</h3>
              <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
{`import { NewsletterWidget } from '@/components/newsletter/NewsletterWidget';

function Sidebar() {
  return (
    <aside className="w-64">
      <NewsletterWidget
        compact={true}
        title="Weekly Digest"
      />
    </aside>
  );
}`}
                </code>
              </pre>
            </div>

            {/* Example 4 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">With Hook</h3>
              <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
{`import { useSubscribeToNewsletter } from '@/hooks/useNewsletter';
import { NewsletterSection } from '@/components/newsletter/NewsletterSection';

function MyPage() {
  const { subscribe, isSubscribed, isLoading } = useSubscribeToNewsletter();

  const handleSubscribe = async (email: string) => {
    await subscribe({ email, tags: ['tech'] });
  };

  return (
    <NewsletterSection
      onSuccess={() => console.log('Subscribed!')}
      onError={(error) => console.error(error)}
    />
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-cyan-500/20 pt-12">
          <h2 className="text-2xl font-bold text-white mb-8">Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email Validation</h3>
              <p className="text-gray-400 text-sm">
                Built-in email validation ensures only valid addresses are submitted
              </p>
            </div>

            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Tag Selection</h3>
              <p className="text-gray-400 text-sm">
                Let subscribers choose their interests with customizable tags
              </p>
            </div>

            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy Compliant</h3>
              <p className="text-gray-400 text-sm">
                Built with privacy in mind, GDPR and CAN-SPAM compliant
              </p>
            </div>

            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Auto-dismiss</h3>
              <p className="text-gray-400 text-sm">
                Popup automatically remembers dismissed state
              </p>
            </div>

            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">React Query</h3>
              <p className="text-gray-400 text-sm">
                Integrated with React Query for data fetching and caching
              </p>
            </div>

            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Customizable</h3>
              <p className="text-gray-400 text-sm">
                Fully customizable with props and Tailwind CSS
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>Built with ❤️ for CyberPress Platform</p>
        </div>
      </footer>
    </div>
  );
}
