'use client';

/**
 * Smart Form Builder Component
 * 智能表单生成器，支持动态字段、验证、自定义主题
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Eye, Save, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'range'
  | 'color'
  | 'rating'
  | 'signature';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, multiselect, radio
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  conditional?: {
    fieldId: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  styling?: {
    width?: 'full' | 'half' | 'third';
    className?: string;
  };
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: {
    submitButtonText: string;
    successMessage: string;
    errorMessage: string;
    redirectUrl?: string;
    sendEmail?: boolean;
    emailTo?: string;
  };
  theme: {
    primaryColor: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    style: 'minimal' | 'modern' | 'cyberpunk' | 'elegant';
  };
}

interface SmartFormBuilderProps {
  /**
   * 初始表单配置
   */
  initialSchema?: Partial<FormSchema>;
  /**
   * 保存回调
   */
  onSave?: (schema: FormSchema) => void;
  /**
   * 预览模式
   */
  previewMode?: boolean;
  /**
   * 只读模式
   */
  readOnly?: boolean;
  /**
   * 自定义样式
   */
  className?: string;
}

// 字段类型配置
const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'text', label: '文本输入', icon: 'T' },
  { type: 'textarea', label: '多行文本', icon: '¶' },
  { type: 'email', label: '邮箱', icon: '@' },
  { type: 'password', label: '密码', icon: '***' },
  { type: 'number', label: '数字', icon: '#' },
  { type: 'tel', label: '电话', icon: '📞' },
  { type: 'url', label: '网址', icon: '🔗' },
  { type: 'date', label: '日期', icon: '📅' },
  { type: 'time', label: '时间', icon: '🕐' },
  { type: 'select', label: '下拉选择', icon: '▼' },
  { type: 'multiselect', label: '多选', icon: '☑' },
  { type: 'checkbox', label: '复选框', icon: '☐' },
  { type: 'radio', label: '单选框', icon: '◉' },
  { type: 'file', label: '文件上传', icon: '📎' },
  { type: 'range', label: '滑块', icon: '━' },
  { type: 'color', label: '颜色选择', icon: '🎨' },
  { type: 'rating', label: '评分', icon: '★' },
];

// 表单字段编辑器
const FieldEditor: React.FC<{
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
  onDragStart?: () => void;
}> = ({ field, onUpdate, onDelete, onDragStart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-black/50 border border-cyan-500/30 rounded-xl overflow-hidden"
    >
      {/* 字段头部 */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className="cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={onDragStart}
        >
          <GripVertical className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{FIELD_TYPES.find(t => t.type === field.type)?.icon}</span>
            <span className="font-medium text-white">{field.label || '未命名字段'}</span>
            {field.required && (
              <span className="text-red-500 text-xs">*</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {FIELD_TYPES.find(t => t.type === field.type)?.label}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
        >
          <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
        </button>
      </div>

      {/* 字段详情 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-cyan-500/20 p-4 space-y-4"
          >
            {/* 基本配置 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">字段标签</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">占位符</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* 选项配置（用于 select, radio 等） */}
            {(field.type === 'select' || field.type === 'multiselect' || field.type === 'radio') && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">选项（每行一个）</label>
                <textarea
                  value={(field.options || []).join('\n')}
                  onChange={(e) => onUpdate({
                    ...field,
                    options: e.target.value.split('\n').filter(o => o.trim())
                  })}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* 验证规则 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">验证规则</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="最小值/长度"
                  value={field.validation?.min || ''}
                  onChange={(e) => onUpdate({
                    ...field,
                    validation: { ...field.validation, min: e.target.value ? Number(e.target.value) : undefined }
                  })}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="number"
                  placeholder="最大值/长度"
                  value={field.validation?.max || ''}
                  onChange={(e) => onUpdate({
                    ...field,
                    validation: { ...field.validation, max: e.target.value ? Number(e.target.value) : undefined }
                  })}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="正则表达式"
                  value={field.validation?.pattern || ''}
                  onChange={(e) => onUpdate({
                    ...field,
                    validation: { ...field.validation, pattern: e.target.value }
                  })}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* 必填选项 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-400">必填字段</span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SmartFormBuilder: React.FC<SmartFormBuilderProps> = ({
  initialSchema,
  onSave,
  previewMode = false,
  readOnly = false,
  className,
}) => {
  const [schema, setSchema] = useState<FormSchema>({
    id: initialSchema?.id || `form-${Date.now()}`,
    name: initialSchema?.name || '未命名表单',
    description: initialSchema?.description || '',
    fields: initialSchema?.fields || [],
    settings: initialSchema?.settings || {
      submitButtonText: '提交',
      successMessage: '提交成功！',
      errorMessage: '提交失败，请重试。',
    },
    theme: initialSchema?.theme || {
      primaryColor: '#00f0ff',
      borderRadius: 'md',
      style: 'cyberpunk',
    },
  });

  const [showAddField, setShowAddField] = useState(false);

  // 添加字段
  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: '新字段',
      placeholder: '',
      required: false,
    };
    setSchema({ ...schema, fields: [...schema.fields, newField] });
    setShowAddField(false);
  };

  // 更新字段
  const updateField = (index: number, field: FormField) => {
    const newFields = [...schema.fields];
    newFields[index] = field;
    setSchema({ ...schema, fields: newFields });
  };

  // 删除字段
  const deleteField = (index: number) => {
    const newFields = schema.fields.filter((_, i) => i !== index);
    setSchema({ ...schema, fields: newFields });
  };

  // 保存表单
  const handleSave = () => {
    onSave?.(schema);
  };

  // 导出表单配置
  const exportSchema = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema.name}-schema.json`;
    link.click();
  };

  // 导入表单配置
  const importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSchema(imported);
      } catch (error) {
        console.error('导入失败:', error);
      }
    };
    reader.readAsText(file);
  };

  if (previewMode) {
    return (
      <div className={cn('max-w-2xl mx-auto', className)}>
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-2">{schema.name}</h2>
          {schema.description && (
            <p className="text-gray-400 mb-6">{schema.description}</p>
          )}

          <form className="space-y-4">
            {schema.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm text-gray-400 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                ) : field.type === 'select' ? (
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500">
                    <option value="">请选择...</option>
                    {field.options?.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {schema.settings.submitButtonText}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <input
              type="text"
              value={schema.name}
              onChange={(e) => setSchema({ ...schema, name: e.target.value })}
              className="text-2xl font-bold text-white bg-transparent focus:outline-none focus:underline"
              disabled={readOnly}
            />
            <textarea
              value={schema.description}
              onChange={(e) => setSchema({ ...schema, description: e.target.value })}
              placeholder="添加表单描述..."
              className="text-gray-400 bg-transparent focus:outline-none resize-none mt-2 w-full"
              rows={2}
              disabled={readOnly}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddField(!showAddField)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              disabled={readOnly}
            >
              <Plus className="w-4 h-4" />
              添加字段
            </button>
            <button
              onClick={handleSave}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              disabled={readOnly}
            >
              <Save className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={exportSchema}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-white" />
              <input
                type="file"
                accept=".json"
                onChange={importSchema}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 字段类型选择器 */}
        <AnimatePresence>
          {showAddField && !readOnly && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-white/5 rounded-xl"
            >
              <h3 className="text-sm text-gray-400 mb-3">选择字段类型</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {FIELD_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => addField(type)}
                    className="flex flex-col items-center gap-2 p-3 bg-black/50 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all"
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-xs text-gray-400">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 字段列表 */}
        <div className="space-y-3">
          <AnimatePresence>
            {schema.fields.map((field, index) => (
              <FieldEditor
                key={field.id}
                field={field}
                onUpdate={(updatedField) => updateField(index, updatedField)}
                onDelete={() => deleteField(index)}
              />
            ))}
          </AnimatePresence>

          {schema.fields.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">点击"添加字段"开始构建表单</p>
            </div>
          )}
        </div>

        {/* 预览按钮 */}
        {schema.fields.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                // 在新标签页打开预览
                const previewWindow = window.open('', '_blank');
                previewWindow?.document.write(`
                  <!DOCTYPE html>
                  <html>
                    <head><title>预览: ${schema.name}</title></head>
                    <body style="margin:0;padding:20px;background:#0a0a0f;font-family:sans-serif;">
                      <div id="root"></div>
                      <script>
                        // 这里可以渲染预览组件
                        document.getElementById('root').innerHTML = '<h1 style="color:white;">${schema.name}</h1><p style="color:#888;">预览模式</p>';
                      </script>
                    </body>
                  </html>
                `);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 text-white" />
              预览表单
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartFormBuilder;
