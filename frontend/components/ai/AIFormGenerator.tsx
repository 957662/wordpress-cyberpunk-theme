'use client';

/**
 * AIFormGenerator - AI驱动的智能表单生成器
 * 使用自然语言描述自动生成表单
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Copy, Download, Eye, Code, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface GeneratedForm {
  title: string;
  description?: string;
  fields: FormField[];
}

interface AIFormGeneratorProps {
  onGenerate?: (prompt: string) => Promise<GeneratedForm>;
  onExport?: (form: GeneratedForm, format: 'tsx' | 'json' | 'html') => void;
  className?: string;
}

// ============================================
// Sub-components
// ============================================

const PromptInput: React.FC<{
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}> = ({ prompt, setPrompt, onGenerate, isGenerating }) => {
  const examplePrompts = [
    'Create a contact form with name, email, and message fields',
    'Build a user registration form with password validation',
    'Generate a survey form with rating questions',
    'Make an event registration form with date and attendee count',
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-cyber-cyan">
          Describe your form
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Create a contact form with name, email, subject, and message fields. Email should be required and validated..."
          className="w-full rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 p-4 text-sm text-cyber-white placeholder:text-cyber-gray/50 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
          rows={4}
        />
      </div>

      {/* 示例提示 */}
      <div className="space-y-2">
        <p className="text-xs text-cyber-gray">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPrompt(example)}
              className="rounded-full border border-cyber-purple/30 bg-cyber-purple/5 px-3 py-1 text-xs text-cyber-purple transition-colors hover:bg-cyber-purple/10"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 生成按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-3 font-bold text-cyber-cyan transition-colors hover:bg-cyber-cyan/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            Generating your form...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            Generate Form
          </>
        )}
      </motion.button>
    </div>
  );
};

const FormPreview: React.FC<{
  form: GeneratedForm;
  onRemoveField: (fieldId: string) => void;
}> = ({ form, onRemoveField }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateField = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div className="space-y-6">
      {/* 表单标题 */}
      <div className="border-b border-cyber-cyan/20 pb-4">
        <h3 className="text-2xl font-bold text-cyber-white">{form.title}</h3>
        {form.description && (
          <p className="mt-2 text-sm text-cyber-gray">{form.description}</p>
        )}
      </div>

      {/* 表单字段 */}
      <div className="space-y-4">
        {form.fields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-lg border border-cyber-cyan/20 bg-cyber-dark/30 p-4"
          >
            <button
              onClick={() => onRemoveField(field.id)}
              className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
              title="Remove field"
            >
              <Trash2 className="h-4 w-4 text-cyber-pink" />
            </button>

            <label className="mb-2 block text-sm font-bold text-cyber-cyan">
              {field.label}
              {field.required && <span className="ml-1 text-cyber-pink">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full rounded border border-cyber-cyan/30 bg-cyber-dark/50 p-3 text-sm text-cyber-white placeholder:text-cyber-gray/50 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
                rows={4}
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.id] || ''}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full rounded border border-cyber-cyan/30 bg-cyber-dark/50 p-3 text-sm text-cyber-white focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' || field.type === 'radio' ? (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type={field.type}
                      name={field.id}
                      value={option}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      className="h-4 w-4 rounded border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-cyan focus:ring-cyber-cyan"
                    />
                    <span className="text-sm text-cyber-white">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full rounded border border-cyber-cyan/30 bg-cyber-dark/50 p-3 text-sm text-cyber-white placeholder:text-cyber-gray/50 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* 提交按钮（预览用） */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-3 font-bold text-cyber-cyan transition-colors hover:bg-cyber-cyan/20"
      >
        Submit
      </motion.button>
    </div>
  );
};

const CodeView: React.FC<{ form: GeneratedForm }> = ({ form }) => {
  const [language, setLanguage] = useState<'tsx' | 'json'>('tsx');

  const generateTSX = () => {
    return `'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ${form.title.replace(/\s+/g, '')}Data {
  ${form.fields.map(f => `  ${f.id}: string;`).join('\n')}
}

export default function ${form.title.replace(/\s+/g, '')}Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: ${form.title.replace(/\s+/g, '')}Data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">${form.title}</h1>
      ${form.description ? `<p className="text-gray-600">${form.description}</p>` : ''}

      ${form.fields.map(field => {
        if (field.type === 'textarea') {
          return `
      <div>
        <label className="block text-sm font-medium">${field.label}</label>
        <textarea
          {...register('${field.id}', { required: ${field.required} })}
          className="w-full rounded border p-2"
          rows={4}
        />
        {errors.${field.id} && <span className="text-red-500">This field is required</span>}
      </div>`;
        } else if (field.type === 'select') {
          return `
      <div>
        <label className="block text-sm font-medium">${field.label}</label>
        <select
          {...register('${field.id}', { required: ${field.required} })}
          className="w-full rounded border p-2"
        >
          <option value="">Select...</option>
          ${field.options?.map(opt => `<option value="${opt}">${opt}</option>`).join('\n          ')}
        </select>
        {errors.${field.id} && <span className="text-red-500">This field is required</span>}
      </div>`;
        } else {
          return `
      <div>
        <label className="block text-sm font-medium">${field.label}</label>
        <input
          type="${field.type}"
          {...register('${field.id}', { required: ${field.required} })}
          className="w-full rounded border p-2"
        />
        {errors.${field.id} && <span className="text-red-500">This field is required</span>}
      </div>`;
        }
      }).join('\n')}

      <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
        Submit
      </button>
    </form>
  );
}`;
  };

  const generateJSON = () => {
    return JSON.stringify(form, null, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-cyber-cyan">Generated Code</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('tsx')}
            className={cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              language === 'tsx'
                ? 'bg-cyber-cyan text-cyber-black'
                : 'bg-cyber-dark text-cyber-gray hover:bg-cyber-gray/20'
            )}
          >
            React/TSX
          </button>
          <button
            onClick={() => setLanguage('json')}
            className={cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              language === 'json'
                ? 'bg-cyber-cyan text-cyber-black'
                : 'bg-cyber-dark text-cyber-gray hover:bg-cyber-gray/20'
            )}
          >
            JSON
          </button>
        </div>
      </div>

      <div className="max-h-[600px] overflow-auto rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 p-4">
        <pre className="text-sm">
          <code className="text-cyber-white">
            {language === 'tsx' ? generateTSX() : generateJSON()}
          </code>
        </pre>
      </div>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

export const AIFormGenerator: React.FC<AIFormGeneratorProps> = ({
  onGenerate,
  onExport,
  className,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [view, setView] = useState<'preview' | 'code'>('preview');

  // 模拟AI生成（实际应用中调用AI API）
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // 这里应该调用AI API，现在用模拟数据
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockForm: GeneratedForm = {
        title: 'Contact Form',
        description: 'Get in touch with us',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'your.email@example.com',
            required: true,
            validation: { pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
          },
          {
            id: 'subject',
            type: 'select',
            label: 'Subject',
            required: true,
            options: ['General Inquiry', 'Support', 'Sales', 'Feedback'],
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'How can we help you?',
            required: true,
          },
        ],
      };

      setGeneratedForm(mockForm);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt]);

  const handleRemoveField = (fieldId: string) => {
    if (!generatedForm) return;
    setGeneratedForm({
      ...generatedForm,
      fields: generatedForm.fields.filter((f) => f.id !== fieldId),
    });
  };

  const handleExport = (format: 'tsx' | 'json' | 'html') => {
    if (!generatedForm) return;
    onExport?.(generatedForm, format);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyber-white">AI Form Generator</h2>
          <p className="text-sm text-cyber-gray">
            Describe your form in plain English, let AI do the rest
          </p>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-dark/30 p-6">
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {/* 生成结果 */}
      <AnimatePresence>
        {generatedForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* 视图切换 */}
            <div className="flex items-center justify-between rounded-lg border border-cyber-cyan/30 bg-cyber-dark/30 p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setView('preview')}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    view === 'preview'
                      ? 'bg-cyber-cyan text-cyber-black'
                      : 'text-cyber-gray hover:bg-cyber-gray/20'
                  )}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => setView('code')}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    view === 'code'
                      ? 'bg-cyber-cyan text-cyber-black'
                      : 'text-cyber-gray hover:bg-cyber-gray/20'
                  )}
                >
                  <Code className="h-4 w-4" />
                  Code
                </button>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('tsx')}
                  className="flex items-center gap-2 rounded-lg border border-cyber-purple/50 bg-cyber-purple/10 px-3 py-2 text-sm font-medium text-cyber-purple transition-colors hover:bg-cyber-purple/20"
                >
                  <Download className="h-4 w-4" />
                  Export
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const code = view === 'code' ? '' : JSON.stringify(generatedForm, null, 2);
                    navigator.clipboard.writeText(code);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-3 py-2 text-sm font-medium text-cyber-cyan transition-colors hover:bg-cyber-cyan/20"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </motion.button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-dark/30 p-6">
              {view === 'preview' ? (
                <FormPreview form={generatedForm} onRemoveField={handleRemoveField} />
              ) : (
                <CodeView form={generatedForm} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIFormGenerator;
