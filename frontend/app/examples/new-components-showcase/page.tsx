'use client';

/**
 * 新组件展示页面
 * 展示所有新创建的高级组件
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUploader } from '@/components/upload';
import { ImageGallery } from '@/components/gallery';
import { InfiniteScroll, VirtualList } from '@/components/scroll';
import { DynamicForm } from '@/components/form';
import { DataTable } from '@/components/table';
import { Calendar } from '@/components/calendar';
import type { GalleryImage } from '@/components/gallery';

export default function NewComponentsShowcasePage() {
  const [activeTab, setActiveTab] = useState('upload');

  // 示例图片数据
  const galleryImages: GalleryImage[] = Array.from({ length: 20 }, (_, i) => ({
    id: `img-${i}`,
    src: `https://picsum.photos/400/${300 + (i % 3) * 100}?random=${i}`,
    alt: `Gallery Image ${i + 1}`,
    title: `图片 ${i + 1}`,
    description: `这是第 ${i + 1} 张示例图片`,
    category: ['风景', '人物', '建筑'][i % 3],
    date: new Date(Date.now() - i * 86400000).toLocaleDateString('zh-CN'),
  }));

  // 示例表单字段
  const formFields = [
    {
      name: 'username',
      type: 'text' as const,
      label: '用户名',
      placeholder: '请输入用户名',
      validation: [
        { type: 'required' as const, message: '用户名不能为空' },
        { type: 'min' as const, value: 3, message: '用户名至少3个字符' },
      ],
    },
    {
      name: 'email',
      type: 'email' as const,
      label: '邮箱',
      placeholder: '请输入邮箱',
      validation: [
        { type: 'required' as const, message: '邮箱不能为空' },
        { type: 'email' as const, message: '邮箱格式不正确' },
      ],
    },
    {
      name: 'role',
      type: 'select' as const,
      label: '角色',
      options: [
        { label: '开发者', value: 'developer' },
        { label: '设计师', value: 'designer' },
        { label: '产品经理', value: 'pm' },
      ],
    },
    {
      name: 'bio',
      type: 'textarea' as const,
      label: '个人简介',
      placeholder: '请输入个人简介',
    },
    {
      name: 'terms',
      type: 'checkbox' as const,
      placeholder: '我同意服务条款',
      validation: [
        { type: 'required' as const, message: '必须同意服务条款' },
      ],
    },
  ];

  // 示例表格数据
  const tableData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['开发者', '设计师', '产品经理'][i % 3],
    status: ['活跃', '离线', '忙碌'][i % 3],
    lastLogin: new Date(Date.now() - i * 3600000).toLocaleString('zh-CN'),
  }));

  const tableColumns = [
    { key: 'id', title: 'ID', width: 60 },
    { key: 'name', title: '姓名', sortable: true },
    { key: 'email', title: '邮箱', sortable: true },
    { key: 'role', title: '角色', filterable: true },
    { key: 'status', title: '状态' },
    { key: 'lastLogin', title: '最后登录' },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold mb-4">
            <span className="text-glow-cyan text-cyber-cyan">新组件</span>
            <span className="text-glow-purple text-cyber-purple">展示</span>
          </h1>
          <p className="text-gray-400 text-lg">
            探索最新创建的高级组件，提升你的开发效率
          </p>
        </motion.div>

        {/* 选项卡导航 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'upload', label: '文件上传' },
            { id: 'gallery', label: '图片画廊' },
            { id: 'scroll', label: '滚动组件' },
            { id: 'form', label: '动态表单' },
            { id: 'table', label: '数据表格' },
            { id: 'calendar', label: '日历组件' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-cyber-cyan text-cyber-dark shadow-lg shadow-cyber-cyan/50'
                  : 'bg-cyber-card text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-8"
        >
          {/* 文件上传 */}
          {activeTab === 'upload' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">文件上传组件</h2>
              <p className="text-gray-400 mb-6">
                支持拖拽上传、多文件上传、预览、进度显示、文件验证
              </p>
              <FileUploader
                multiple
                maxFiles={10}
                maxSize={10}
                accept="image/*,video/*,.pdf,.doc,.docx"
                onUpload={async (files) => {
                  // 模拟上传
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  console.log('上传成功:', files);
                }}
              />
            </div>
          )}

          {/* 图片画廊 */}
          {activeTab === 'gallery' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">图片画廊组件</h2>
              <p className="text-gray-400 mb-6">
                支持 Masonry 布局、Lightbox 预览、图片过滤、懒加载
              </p>
              <ImageGallery
                images={galleryImages}
                layout="masonry"
                columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                enableFilter
                enableLightbox
                enableDownload
              />
            </div>
          )}

          {/* 滚动组件 */}
          {activeTab === 'scroll' && (
            <div className="space-y-12">
              {/* 无限滚动 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">无限滚动组件</h2>
                <p className="text-gray-400 mb-6">
                  自动加载数据，支持手动加载、加载状态、错误处理
                </p>
                <InfiniteScroll
                  fetchData={async (page) => {
                    // 模拟API调用
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return Array.from({ length: 10 }, (_, i) => ({
                      id: `item-${page}-${i}`,
                      title: `项目 ${page}-${i + 1}`,
                      description: `这是第 ${page} 页的第 ${i + 1} 条数据`,
                    }));
                  }}
                  renderItem={(item, index) => (
                    <div key={item.id} className="cyber-card p-4 mb-4">
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  )}
                  pageSize={10}
                  autoLoad
                />
              </div>

              {/* 虚拟滚动 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">虚拟滚动列表</h2>
                <p className="text-gray-400 mb-6">
                  高性能渲染大量数据，只渲染可见区域的项
                </p>
                <div className="cyber-card p-4">
                  <VirtualList
                    items={Array.from({ length: 10000 }, (_, i) => ({
                      id: i,
                      title: `项目 ${i + 1}`,
                      description: `这是第 ${i + 1} 条数据`,
                    }))}
                    renderItem={(item) => (
                      <div className="cyber-card p-4 mb-2">
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    )}
                    itemHeight={100}
                    height={400}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 动态表单 */}
          {activeTab === 'form' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">动态表单组件</h2>
              <p className="text-gray-400 mb-6">
                支持动态字段、验证、多步表单、条件显示
              </p>
              <DynamicForm
                fields={formFields}
                onSubmit={async (data) => {
                  console.log('表单提交:', data);
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
                submitText="提交表单"
              />
            </div>
          )}

          {/* 数据表格 */}
          {activeTab === 'table' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">数据表格组件</h2>
              <p className="text-gray-400 mb-6">
                支持排序、筛选、分页、选择、自定义单元格
              </p>
              <DataTable
                data={tableData}
                columns={tableColumns}
                rowKey="id"
                selectable
                pagination={{
                  current: 1,
                  pageSize: 10,
                  total: tableData.length,
                  showSizeChanger: true,
                  pageSizeOptions: [10, 20, 50],
                  showTotal: (total, range) => `共 ${total} 条，显示 ${range[0]}-${range[1]} 条`,
                }}
                striped
                bordered
              />
            </div>
          )}

          {/* 日历组件 */}
          {activeTab === 'calendar' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">日历组件</h2>
                <p className="text-gray-400 mb-6">
                  支持单选、多选、范围选择、事件标记
                </p>

                {/* 单选 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">单选模式</h3>
                  <Calendar
                    mode="single"
                    onChange={(value) => console.log('选中日期:', value)}
                  />
                </div>

                {/* 范围选择 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">范围选择</h3>
                  <Calendar
                    mode="range"
                    onChange={(value) => console.log('选中范围:', value)}
                  />
                </div>
              </div>

              <div>
                {/* 多选 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">多选模式</h3>
                  <Calendar
                    mode="multiple"
                    onChange={(value) => console.log('选中日期:', value)}
                  />
                </div>

                {/* 带事件的日历 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">带事件标记</h3>
                  <Calendar
                    mode="single"
                    markedDates={[
                      new Date(),
                      new Date(Date.now() + 86400000),
                      new Date(Date.now() + 172800000),
                    ]}
                    events={[
                      {
                        date: new Date(),
                        title: '今天',
                        color: '#00f0ff',
                      },
                      {
                        date: new Date(Date.now() + 86400000),
                        title: '明天',
                        color: '#9d00ff',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 cyber-card p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">使用说明</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              所有组件都支持完整的 TypeScript 类型定义，提供智能代码提示。
            </p>
            <p>
              组件采用赛博朋克风格设计，与整体主题保持一致。
            </p>
            <p>
              所有组件都是响应式设计，适配移动端和桌面端。
            </p>
            <div className="mt-4 p-4 bg-cyber-dark/50 rounded-lg">
              <code className="text-sm text-cyber-cyan">
                import {'{'} FileUploader, ImageGallery, DataTable {'}'} from '@/components';
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
