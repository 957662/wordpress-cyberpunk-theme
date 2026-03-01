/**
 * 联系页面模板
 */

import { PageHeader } from '@/components/layout';
import { ContactForm } from '@/components/ui';
import { StarIcon } from '@/components/icons';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="联系我们"
        description="有任何问题？欢迎与我们联系"
        icon={<StarIcon className="w-8 h-8" />}
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-8">
          <ContactForm
            onSubmit={async (data) => {
              // TODO: 实现表单提交逻辑
              console.log('Form submitted:', data);
            }}
            fields={[
              {
                name: 'name',
                label: '姓名',
                type: 'text',
                required: true,
                placeholder: '请输入您的姓名',
              },
              {
                name: 'email',
                label: '邮箱',
                type: 'email',
                required: true,
                placeholder: '请输入您的邮箱',
              },
              {
                name: 'subject',
                label: '主题',
                type: 'text',
                required: true,
                placeholder: '请输入主题',
              },
              {
                name: 'message',
                label: '消息',
                type: 'textarea',
                required: true,
                placeholder: '请输入您的消息',
                rows: 6,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
