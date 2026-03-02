import { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: '关于 - CyberPress Platform',
  description: '了解更多关于 CyberPress Platform 的信息',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white mb-4 text-center"
        >
          关于我们
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-center text-lg"
        >
          致力于打造最优秀的赛博朋克风格博客平台
        </motion.p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12 mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">我们的使命</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed">
                CyberPress Platform 是一个基于现代化技术栈构建的博客平台，我们致力于为用户提供
                最佳的写作和阅读体验。平台采用赛博朋克风格设计，融合未来科技感与极致用户体验。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
