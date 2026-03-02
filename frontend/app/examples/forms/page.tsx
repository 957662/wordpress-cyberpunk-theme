/**
 * 智能表单示例页面
 */

'use client';

import React from 'react';
import { SmartForm, FormField } from '@/components/forms/SmartForm';

const formFields: FormField[] = [
  {
    id: 'username',
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
    required: true,
    validation: {
      min: 3,
      max: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      custom: (value) => {
        if (value.includes('admin')) {
          return '用户名不能包含admin';
        }
        return null;
      }
    },
    helpText: '3-20个字符，只能包含字母、数字和下划线',
    aiSuggestion: true
  },
  {
    id: 'email',
    type: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱地址',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    helpText: '我们将发送验证邮件到该地址',
    aiSuggestion: true
  },
  {
    id: 'role',
    type: 'select',
    label: '角色',
    placeholder: '请选择角色',
    required: true,
    options: [
      { label: '开发者', value: 'developer' },
      { label: '设计师', value: 'designer' },
      { label: '产品经理', value: 'pm' },
      { label: '其他', value: 'other' }
    ]
  },
  {
    id: 'experience',
    type: 'number',
    label: '工作经验（年）',
    placeholder: '请输入工作年限',
    required: false,
    validation: {
      min: 0,
      max: 50
    },
    conditional: {
      field: 'role',
      value: 'developer'
    }
  },
  {
    id: 'portfolio',
    type: 'textarea',
    label: '作品集',
    placeholder: '请介绍你的作品集',
    required: false,
    validation: {
      max: 500
    },
    conditional: {
      field: 'role',
      value: 'designer'
    },
    helpText: '最多500个字符',
    aiSuggestion: true
  },
  {
    id: 'terms',
    type: 'checkbox',
    label: '同意条款',
    placeholder: '我已阅读并同意服务条款',
    required: true
  }
];

export default function FormsExamplePage() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log('表单数据:', data);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleChange = (data: Record<string, any>, isValid: boolean) => {
    console.log('表单变更:', data, '有效:', isValid);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-cyber-cyan mb-2">
          智能表单
        </h1>
        <p className="text-cyber-muted">
          支持动态验证、条件显示、AI辅助填写的智能表单
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SmartForm
          fields={formFields}
          onSubmit={handleSubmit}
          onChange={handleChange}
          submitText="注册"
          showProgress={true}
          enableAI={true}
        />
      </div>
    </div>
  );
}
