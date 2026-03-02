/**
 * FAQ 页面
 */

import { Metadata } from 'next';
import { Accordion } from '@/components/ui/Accordion';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: '常见问题 - CyberPress',
  description: 'CyberPress 平台的常见问题解答',
};

const faqData = [
  {
    category: '通用问题',
    questions: [
      {
        q: '什么是 CyberPress?',
        a: 'CyberPress 是一个基于 WordPress + Next.js 的现代化博客平台。',
      },
      {
        q: '是免费的吗?',
        a: '是的,完全开源,基于 MIT 许可证。',
      },
    ],
  },
  {
    category: '安装部署',
    questions: [
      {
        q: '系统要求?',
        a: '需要 Node.js 18.17+, npm 9.0+, Docker 和 Docker Compose。',
      },
      {
        q: '如何安装?',
        a: '请参考项目 README.md 文档。',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-6">常见问题</h1>
        <p className="text-xl text-cyber-muted mb-8">快速找到您需要的答案</p>

        <div className="mb-8">
          <SearchBar placeholder="搜索问题..." />
        </div>

        {faqData.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((faq, i) => (
                <Accordion key={i} title={faq.q} className="bg-cyber-muted/10 border border-cyber-cyan/30 rounded-lg">
                  <p className="text-cyber-muted">{faq.a}</p>
                </Accordion>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
