'use client';

/**
 * Illustration Gallery Component
 * 展示项目中所有可用的插图
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Illustration {
  id: string;
  name: string;
  path: string;
  category: 'status' | 'feature' | 'tech' | 'abstract';
}

const illustrations: Illustration[] = [
  // Status Illustrations
  { id: '404-glitch', name: '404 Glitch', path: '/illustrations/404-glitch.svg', category: 'status' },
  { id: 'coming-soon', name: 'Coming Soon', path: '/illustrations/coming-soon.svg', category: 'status' },
  { id: 'under-construction', name: 'Under Construction', path: '/illustrations/under-construction.svg', category: 'status' },
  { id: 'maintenance-mode', name: 'Maintenance Mode', path: '/illustrations/maintenance-mode.svg', category: 'status' },
  { id: 'access-forbidden', name: 'Access Forbidden', path: '/illustrations/access-forbidden.svg', category: 'status' },
  { id: 'feature-beta', name: 'Feature Beta', path: '/illustrations/feature-beta.svg', category: 'status' },
  { id: 'success-check', name: 'Success Check', path: '/illustrations/success-check.svg', category: 'status' },
  { id: 'error-state', name: 'Error State', path: '/illustrations/error-state.svg', category: 'status' },
  { id: 'empty-state', name: 'Empty State', path: '/illustrations/empty-state.svg', category: 'status' },
  { id: 'no-results', name: 'No Results', path: '/illustrations/no-results.svg', category: 'status' },

  // Tech Illustrations
  { id: 'server-rack', name: 'Server Rack', path: '/illustrations/server-rack.svg', category: 'tech' },
  { id: 'code-screen', name: 'Code Screen', path: '/illustrations/code-screen.svg', category: 'tech' },
  { id: 'circuit-board', name: 'Circuit Board', path: '/illustrations/circuit-board.svg', category: 'tech' },
  { id: 'network-globe', name: 'Network Globe', path: '/illustrations/network-globe.svg', category: 'tech' },
  { id: 'cyber-server', name: 'Cyber Server', path: '/illustrations/cyber-server.svg', category: 'tech' },
  { id: 'cyber-network', name: 'Cyber Network', path: '/illustrations/cyber-network.svg', category: 'tech' },
  { id: 'cyber-coding', name: 'Cyber Coding', path: '/illustrations/cyber-coding.svg', category: 'tech' },
  { id: 'cyber-shield-security', name: 'Cyber Shield', path: '/illustrations/cyber-shield-security.svg', category: 'tech' },
  { id: 'ai-neural-network', name: 'AI Neural Network', path: '/illustrations/ai-neural-network.svg', category: 'tech' },
  { id: 'holographic-data', name: 'Holographic Data', path: '/illustrations/holographic-data.svg', category: 'tech' },

  // Feature Illustrations
  { id: 'cyber-city', name: 'Cyber City', path: '/illustrations/cyber-city.svg', category: 'feature' },
  { id: 'developer-workspace', name: 'Developer Workspace', path: '/illustrations/developer-workspace.svg', category: 'feature' },
  { id: 'network-nodes', name: 'Network Nodes', path: '/illustrations/network-nodes.svg', category: 'feature' },
  { id: 'cyberpunk-hacker', name: 'Cyberpunk Hacker', path: '/illustrations/cyberpunk-hacker.svg', category: 'feature' },
  { id: 'space-station', name: 'Space Station', path: '/illustrations/space-station.svg', category: 'feature' },

  // Abstract Illustrations
  { id: 'holographic-effect', name: 'Holographic Effect', path: '/illustrations/abstracts/holographic-effect.svg', category: 'abstract' },
];

const categories = [
  { id: 'all', name: 'All', color: 'from-cyber-cyan to-cyber-purple' },
  { id: 'status', name: 'Status', color: 'from-cyber-pink to-cyber-purple' },
  { id: 'feature', name: 'Feature', color: 'from-cyber-cyan to-cyber-green' },
  { id: 'tech', name: 'Tech', color: 'from-cyber-purple to-cyber-cyan' },
  { id: 'abstract', name: 'Abstract', color: 'from-cyber-yellow to-cyber-pink' },
];

export function IllustrationGalleryNew() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIllustration, setSelectedIllustration] = useState<Illustration | null>(null);

  const filteredIllustrations = selectedCategory === 'all'
    ? illustrations
    : illustrations.filter(ill => ill.category === selectedCategory);

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-4">
          Illustration Gallery
        </h1>
        <p className="text-gray-400">
          Browse and use {illustrations.length} cyberpunk-styled illustrations
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-cyber-cyan/50`
                : 'bg-cyber-card border border-cyber-border text-gray-400 hover:border-cyber-cyan'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Illustrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIllustrations.map((illustration, index) => (
          <motion.div
            key={illustration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-cyber-card border border-cyber-border rounded-lg overflow-hidden hover:border-cyber-cyan transition-all"
          >
            {/* Preview */}
            <div className="aspect-square bg-cyber-darker p-4 flex items-center justify-center">
              <img
                src={illustration.path}
                alt={illustration.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-medium mb-1">{illustration.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{illustration.path}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setSelectedIllustration(illustration)}
                  className="flex-1 px-3 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-cyber-cyan text-sm hover:bg-cyber-cyan/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Preview
                </motion.button>
                <motion.button
                  onClick={() => copyPath(illustration.path)}
                  className="px-3 py-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded text-cyber-purple text-sm hover:bg-cyber-purple/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Copy
                </motion.button>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/0 to-cyber-purple/0 group-hover:from-cyber-cyan/5 group-hover:to-cyber-purple/5 transition-all pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedIllustration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
          onClick={() => setSelectedIllustration(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cyber-card border border-cyber-cyan rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-cyber-card/95 backdrop-blur border-b border-cyber-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedIllustration.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedIllustration.path}</p>
              </div>
              <button
                onClick={() => setSelectedIllustration(null)}
                className="p-2 hover:bg-cyber-border rounded transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="p-8 bg-cyber-darker">
              <img
                src={selectedIllustration.path}
                alt={selectedIllustration.name}
                className="w-full h-auto"
              />
            </div>

            {/* Usage Code */}
            <div className="p-6 border-t border-cyber-border">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Usage Example</h3>
              <pre className="bg-cyber-darker p-4 rounded-lg text-sm text-cyber-cyan overflow-x-auto">
{`<img
  src="${selectedIllustration.path}"
  alt="${selectedIllustration.name}"
  className="w-full h-auto"
/>`}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-cyber-card border border-cyber-border rounded-lg p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-cyber-cyan mb-2">{illustrations.length}</div>
          <div className="text-sm text-gray-400">Total Illustrations</div>
        </motion.div>
        <motion.div
          className="bg-cyber-card border border-cyber-border rounded-lg p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-cyber-purple mb-2">
            {illustrations.filter(i => i.category === 'status').length}
          </div>
          <div className="text-sm text-gray-400">Status</div>
        </motion.div>
        <motion.div
          className="bg-cyber-card border border-cyber-border rounded-lg p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-cyber-pink mb-2">
            {illustrations.filter(i => i.category === 'tech').length}
          </div>
          <div className="text-sm text-gray-400">Tech</div>
        </motion.div>
        <motion.div
          className="bg-cyber-card border border-cyber-border rounded-lg p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold text-cyber-green mb-2">
            {illustrations.filter(i => i.category === 'feature').length}
          </div>
          <div className="text-sm text-gray-400">Feature</div>
        </motion.div>
      </div>
    </div>
  );
}

export default IllustrationGalleryNew;
