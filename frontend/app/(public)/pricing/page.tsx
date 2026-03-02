/**
 * 定价页面
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '定价方案 - CyberPress',
  description: '选择适合您的定价方案',
};

const plans = [
  {
    name: '免费版',
    price: '¥0',
    features: ['基础博客功能', '5 个项目', '1GB 存储', '社区支持'],
    highlighted: false,
  },
  {
    name: '专业版',
    price: '¥99/月',
    features: ['无限项目', '50GB 存储', '邮件支持', '自定义域名', 'API 访问'],
    highlighted: true,
  },
  {
    name: '企业版',
    price: '¥299/月',
    features: ['无限存储', '24/7 支持', '专属客户经理', 'SLA 保证'],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">选择适合您的方案</h1>
          <p className="text-xl text-cyber-muted">灵活的定价,满足不同规模的需求</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-cyber-muted/10 border rounded-xl p-8 ${
                plan.highlighted
                  ? 'border-cyber-purple shadow-neon-purple scale-105'
                  : 'border-cyber-cyan/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyber-purple to-cyber-pink text-white text-sm font-bold px-4 py-1 rounded-full">
                    推荐
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-cyber-cyan mb-6">{plan.price}</div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white">
                    <svg className="w-5 h-5 text-cyber-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded font-bold transition-all ${
                  plan.highlighted
                    ? 'bg-cyber-purple text-white hover:bg-cyber-purple/80'
                    : 'border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/20'
                }`}
              >
                {plan.highlighted ? '立即升级' : '开始使用'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
