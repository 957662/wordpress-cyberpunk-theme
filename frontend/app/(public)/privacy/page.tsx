/**
 * 隐私政策页面
 */

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '隐私政策 | CyberPress',
  description: 'CyberPress 平台隐私政策',
};

const privacySections = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: '信息收集',
    color: 'cyber-cyan',
    points: [
      '个人信息：姓名、邮箱地址等（仅当您主动提供时）',
      '使用数据：访问时间、浏览页面、点击行为等',
      '技术数据：IP 地址、浏览器类型、设备信息等',
      'Cookie 数据：用于改善用户体验和记住偏好设置',
    ],
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: '信息使用',
    color: 'cyber-purple',
    points: [
      '提供和改进我们的服务',
      '回应您的请求和问题',
      '发送重要通知和更新',
      '分析平台使用情况，优化性能',
      '防范欺诈和确保安全',
    ],
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: '信息保护',
    color: 'cyber-pink',
    points: [
      '采用加密技术保护数据传输',
      '实施访问控制，限制内部访问',
      '定期进行安全审查和更新',
      '遵守数据保护法律法规',
      '不会向第三方出售您的个人信息',
    ],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: '您的权利',
    color: 'cyber-yellow',
    points: [
      '访问和查看您的个人信息',
      '要求更正不准确的信息',
      '要求删除您的个人信息',
      '反对或限制某些数据处理活动',
      '数据可携带权',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              隐私政策
            </h1>
            <p className="text-gray-400">
              最后更新：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <p className="text-gray-300 leading-relaxed">
              在 CyberPress，我们非常重视您的隐私。本隐私政策说明了我们如何收集、使用、保护和分享您的信息。
              使用我们的服务即表示您同意本隐私政策中描述的做法。
            </p>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-6 mb-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="neon" glowColor={section.color as any}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-${section.color}`}>
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {section.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <span className={`text-${section.color} mt-1`}>
                          •
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Cookie Policy */}
          <Card className="mb-8">
            <h2 className="text-2xl font-display font-bold text-cyber-cyan mb-4">
              Cookie 政策
            </h2>
            <p className="text-gray-300 mb-4">
              我们使用 Cookie 和类似技术来改善您的体验、分析使用情况并提供个性化内容。
              您可以通过浏览器设置管理 Cookie 偏好。
            </p>
            <div className="flex gap-4 flex-wrap">
              {[
                '必要 Cookie',
                '分析 Cookie',
                '功能 Cookie',
                '营销 Cookie',
              ].map((type, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-cyber-muted border border-cyber-border rounded-lg text-sm text-gray-400"
                >
                  {type}
                </span>
              ))}
            </div>
          </Card>

          {/* Third-Party Services */}
          <Card className="mb-8">
            <h2 className="text-2xl font-display font-bold text-cyber-cyan mb-4">
              第三方服务
            </h2>
            <p className="text-gray-300 mb-4">
              我们的平台可能集成以下第三方服务：
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• 内容分发网络（CDN）</li>
              <li>• 分析服务（如 Google Analytics）</li>
              <li>• 社交媒体插件</li>
              <li>• 评论系统</li>
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              这些服务有自己的隐私政策，我们建议您查看其条款。
            </p>
          </Card>

          {/* Contact */}
          <Card>
            <h2 className="text-2xl font-display font-bold text-cyber-cyan mb-4">
              联系我们
            </h2>
            <p className="text-gray-300 mb-4">
              如果您对本隐私政策有任何疑问或关注，请通过以下方式联系我们：
            </p>
            <div className="space-y-2 text-gray-300">
              <p>📧 邮箱：privacy@cyberpress.com</p>
              <p>📍 地址：中国，赛博城，2077 号</p>
              <p>🌐 网站：https://cyberpress.com</p>
            </div>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center text-gray-500 text-sm mt-12"
          >
            © {new Date().getFullYear()} CyberPress. All rights reserved.
          </motion.p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
