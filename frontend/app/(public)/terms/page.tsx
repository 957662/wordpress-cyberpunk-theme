/**
 * 服务条款页面
 */

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '服务条款 | CyberPress',
  description: 'CyberPress 平台服务条款',
};

const termsSections = [
  {
    title: '1. 服务条款的接受',
    content: `
      欢迎使用 CyberPress 平台。通过访问或使用本平台，您确认您已阅读、理解并同意受这些服务条款的约束。
      如果您不同意这些条款，请不要使用本平台。
    `,
  },
  {
    title: '2. 服务描述',
    content: `
      CyberPress 是一个基于 WordPress 和 Next.js 构建的赛博朋克风格博客平台。
      我们提供博客文章发布、作品展示、用户评论等功能。我们保留随时修改或暂停服务的权利，
      无需事先通知。
    `,
  },
  {
    title: '3. 用户责任',
    content: `
      使用本平台时，您同意：
      - 不发布违法、有害、威胁、辱骂、骚扰或其他令人反感的内容
      - 不侵犯他人的知识产权或隐私权
      - 不尝试未经授权访问平台的任何部分
      - 不传播病毒或恶意代码
      - 遵守所有适用的法律法规
    `,
  },
  {
    title: '4. 知识产权',
    content: `
      平台上的所有内容，包括但不限于文本、图形、标识、图像和软件，
      均受版权法和其他知识产权法的保护。未经明确许可，您不得复制、修改、分发或以其他方式使用这些内容。
    `,
  },
  {
    title: '5. 隐私保护',
    content: `
      我们重视您的隐私。我们收集的信息将按照我们的隐私政策进行处理。
      使用本平台即表示您同意我们按照隐私政策收集和使用您的信息。
    `,
  },
  {
    title: '6. 免责声明',
    content: `
      本平台按"原样"提供，不提供任何明示或暗示的保证。
      我们不对平台的准确性、可靠性或内容做出任何保证。
      在法律允许的最大范围内，我们不承担任何直接或间接的损害责任。
    `,
  },
  {
    title: '7. 条款变更',
    content: `
      我们保留随时修改这些条款的权利。
      重大变更将通过平台通知您。继续使用平台即表示您接受修改后的条款。
    `,
  },
  {
    title: '8. 联系我们',
    content: `
      如果您对这些服务条款有任何疑问，请通过以下方式联系我们：
      - 邮箱：contact@cyberpress.com
      - 地址：中国，赛博城，2077 号
    `,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-display font-bold text-white mb-4 text-center">
            服务条款
          </h1>
          <p className="text-gray-400 text-center mb-12">
            最后更新：{new Date().toLocaleDateString('zh-CN')}
          </p>

          <div className="space-y-6">
            {termsSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <h2 className="text-2xl font-display font-bold text-cyber-cyan mb-4">
                    {section.title}
                  </h2>
                  <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CyberPress. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
