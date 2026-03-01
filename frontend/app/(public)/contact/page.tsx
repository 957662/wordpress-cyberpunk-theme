/**
 * 联系页面
 */

import { Metadata } from 'next';
import { ContactForm } from '@/components/ui/ContactForm';
import { NewsletterForm } from '@/components/ui/ContactForm';
import { Card } from '@/components/ui/Card';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: '联系我们',
  description: '有任何问题或合作意向？欢迎与我们联系。',
};

export default function ContactPage() {
  const handleContactSubmit = async (data: any) => {
    // TODO: 实现实际的表单提交逻辑
    console.log('Contact form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleNewsletterSubmit = async (email: string) => {
    // TODO: 实现实际的订阅逻辑
    console.log('Newsletter subscription:', email);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-4">
            联系我们
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            有任何问题、建议或合作意向？欢迎随时与我们联系，我们会尽快回复您。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 联系表单 */}
          <div className="lg:col-span-2">
            <ContactForm onSubmit={handleContactSubmit} />
          </div>

          {/* 右侧信息 */}
          <div className="space-y-6">
            {/* 联系方式 */}
            <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-cyber-cyan mb-4">联系方式</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyber-purple mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-300">邮箱</p>
                    <p className="text-gray-400">contact@cyberpress.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyber-green mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-300">电话</p>
                    <p className="text-gray-400">+86 123-4567-8900</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyber-pink mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-300">地址</p>
                    <p className="text-gray-400">中国 · 北京市朝阳区</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 订阅更新 */}
            <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50 backdrop-blur-sm">
              <NewsletterForm onSubmit={handleNewsletterSubmit} />
            </Card>

            {/* 社交媒体 */}
            <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-cyber-cyan mb-4">关注我们</h3>
              <div className="flex gap-4">
                {[
                  { name: 'GitHub', icon: 'github.svg', url: '#' },
                  { name: 'Twitter', icon: 'twitter.svg', url: '#' },
                  { name: 'LinkedIn', icon: 'linkedin.svg', url: '#' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
                  >
                    <img src={`/icons/${social.icon}`} alt={social.name} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
