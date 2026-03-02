import { Metadata } from 'next';
import { motion } from 'framer-motion';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: '联系我们 - CyberPress Platform',
  description: '联系 CyberPress Platform 团队',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white mb-4 text-center"
        >
          联系我们
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-center text-lg"
        >
          我们随时准备为您提供帮助
        </motion.p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">发送消息</h2>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
