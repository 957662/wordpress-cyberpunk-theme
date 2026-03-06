/**
 * 全组件展示页面
 * 展示项目中的所有 UI 组件
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AllComponentsShowcasePage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 头部 */}
      <header className="border-b border-cyber-border bg-cyber-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              CyberPress <span className="text-cyber-cyan">Components</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              赛博朋克风格 UI 组件库完整展示
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              返回首页
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类导航 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {componentCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="px-4 py-2 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-colors text-sm text-gray-300"
            >
              {category.icon} {category.name}
            </a>
          ))}
        </div>

        {/* 组件分类展示 */}
        {componentCategories.map((category) => (
          <section key={category.id} id={category.id} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-3xl font-bold text-white">{category.name}</h2>
              <span className="px-2 py-1 bg-cyber-cyan/20 text-cyber-cyan text-xs rounded">
                {category.components.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.components.map((component) => (
                <Card key={component.name} variant="neon" glowColor="cyan" hover>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {component.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          component.status === 'complete'
                            ? 'bg-green-500/20 text-green-400'
                            : component.status === 'partial'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {component.status === 'complete' ? '✓ 完成' : component.status === 'partial' ? '◐ 部分完成' : '○ 待开发'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400">{component.description}</p>

                    {component.features && (
                      <ul className="text-xs text-gray-500 space-y-1">
                        {component.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-cyber-cyan">▹</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex gap-2">
                      {component.path && (
                        <Link
                          href={component.path}
                          className="flex-1 text-center px-3 py-2 bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan rounded hover:bg-cyber-cyan/30 transition-colors text-sm"
                        >
                          查看演示
                        </Link>
                      )}
                      {component.docs && (
                        <a
                          href={component.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-cyber-muted border border-cyber-border text-gray-300 rounded hover:bg-cyber-muted/70 transition-colors text-sm"
                        >
                          文档
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-cyber-border bg-cyber-card/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          <p>CyberPress UI Component Library © 2026</p>
          <p className="mt-2">
            赛博朋克设计系统 | Next.js 15 | React 19 | TypeScript | Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

// 组件分类数据
const componentCategories = [
  {
    id: 'basic',
    name: '基础组件',
    icon: '🧩',
    components: [
      {
        name: 'Button',
        description: '按钮组件，支持多种样式和状态',
        status: 'complete',
        features: ['5种变体', '3种尺寸', '加载状态', '图标支持', '全宽选项'],
        path: '/components-usage',
      },
      {
        name: 'Input',
        description: '输入框组件，支持多种输入类型',
        status: 'complete',
        features: ['文本/密码/邮箱', '前后缀', '错误状态', '禁用状态', '字符计数'],
        path: '/components-usage',
      },
      {
        name: 'Select',
        description: '下拉选择组件',
        status: 'complete',
        features: ['单选/多选', '分组选项', '搜索过滤', '虚拟滚动'],
      },
      {
        name: 'Checkbox',
        description: '复选框组件',
        status: 'complete',
        features: ['单独使用', '复选框组', '不确定状态', '自定义样式'],
      },
      {
        name: 'Radio',
        description: '单选框组件',
        status: 'complete',
        features: ['单选组', '预设选项', '自定义样式', '描述文本'],
        path: '/components-usage',
      },
      {
        name: 'Switch',
        description: '开关组件',
        status: 'complete',
        features: ['开/关状态', '禁用状态', '自定义颜色', '标签显示'],
      },
      {
        name: 'Slider',
        description: '滑块组件',
        status: 'complete',
        features: ['单值滑块', '范围滑块', '垂直/水平', '刻度标记', '步进设置'],
        path: '/components-usage',
      },
      {
        name: 'Textarea',
        description: '多行文本输入组件',
        status: 'complete',
        features: ['自动调整高度', '字符计数', '最大长度限制'],
      },
      {
        name: 'Toggle',
        description: '切换组件',
        status: 'complete',
        features: ['开/关', '分组切换', '受控/非受控'],
      },
    ],
  },
  {
    id: 'feedback',
    name: '反馈组件',
    icon: '💬',
    components: [
      {
        name: 'Alert',
        description: '警告提示组件',
        status: 'complete',
        features: ['4种类型', '可关闭', '图标支持', '标题/描述'],
      },
      {
        name: 'Toast',
        description: '消息提示组件',
        status: 'complete',
        features: ['自动关闭', '位置配置', '堆叠管理', '进度条'],
      },
      {
        name: 'Notification',
        description: '通知组件',
        status: 'complete',
        features: ['多种样式', '操作按钮', '分组显示', '标记已读'],
      },
      {
        name: 'Progress',
        description: '进度条组件',
        status: 'complete',
        features: ['线性进度条', '圆形进度条', '百分比显示', '多色渐变'],
        path: '/components-usage',
      },
      {
        name: 'Loading',
        description: '加载状态组件',
        status: 'complete',
        features: ['多种动画', '尺寸可选', '自定义颜色', '全屏遮罩'],
      },
      {
        name: 'Skeleton',
        description: '骨架屏组件',
        status: 'complete',
        features: ['多种形状', '预设模板', '动画效果'],
        path: '/components-usage',
      },
      {
        name: 'EmptyState',
        description: '空状态组件',
        status: 'complete',
        features: ['多种类型', '自定义内容', '操作按钮'],
        path: '/components-usage',
      },
    ],
  },
  {
    id: 'navigation',
    name: '导航组件',
    icon: '🧭',
    components: [
      {
        name: 'Tabs',
        description: '选项卡组件',
        status: 'complete',
        features: ['水平/垂直', '动画指示器', '懒加载内容'],
        path: '/components-usage',
      },
      {
        name: 'Breadcrumb',
        description: '面包屑导航组件',
        status: 'complete',
        features: ['层级展示', '自定义分隔符', '图标支持'],
      },
      {
        name: 'Pagination',
        description: '分页组件',
        status: 'complete',
        features: ['页码跳转', '上下页', '省略号', '页码选择'],
      },
      {
        name: 'Steps',
        description: '步骤条组件',
        status: 'complete',
        features: ['水平/垂直', '状态指示', '描述信息', '可点击'],
      },
      {
        name: 'Menu',
        description: '菜单组件',
        status: 'complete',
        features: ['嵌套子菜单', '快捷键', '分隔线', '图标支持'],
        path: '/components-usage',
      },
      {
        name: 'Dropdown',
        description: '下拉菜单组件',
        status: 'complete',
        features: ['触发方式', '位置配置', '动画效果'],
      },
      {
        name: 'ContextMenu',
        description: '右键菜单组件',
        status: 'complete',
        features: ['触发区域', '快捷键', '分隔线'],
      },
      {
        name: 'CommandMenu',
        description: '命令面板组件',
        status: 'complete',
        features: ['搜索过滤', '快捷键', '分组显示', '键盘导航'],
        path: '/components-usage',
      },
    ],
  },
  {
    id: 'data-display',
    name: '数据展示',
    icon: '📊',
    components: [
      {
        name: 'Card',
        description: '卡片组件',
        status: 'complete',
        features: ['多种样式', '悬停效果', '发光边框', '装饰元素'],
        path: '/components-usage',
      },
      {
        name: 'Table',
        description: '表格组件',
        status: 'complete',
        features: ['排序', '筛选', '分页', '选择行', '固定行列'],
      },
      {
        name: 'List',
        description: '列表组件',
        status: 'complete',
        features: ['虚拟滚动', '分组', '排序', '拖拽排序'],
      },
      {
        name: 'Tree',
        description: '树形组件',
        status: 'complete',
        features: ['多层级', '展开/收起', '选择', '拖拽'],
      },
      {
        name: 'Tag',
        description: '标签组件',
        status: 'complete',
        features: ['多种颜色', '可关闭', '自定义样式'],
      },
      {
        name: 'Badge',
        description: '徽章组件',
        status: 'complete',
        features: ['多种类型', '状态指示', '计数', '动画'],
        path: '/components-usage',
      },
      {
        name: 'Avatar',
        description: '头像组件',
        status: 'complete',
        features: ['多种形状', '状态指示', '头像组', '回退文字'],
        path: '/components-usage',
      },
      {
        name: 'Tooltip',
        description: '提示框组件',
        status: 'complete',
        features: ['12个方向', '自动定位', '延迟显示', '富文本'],
        path: '/components-usage',
      },
      {
        name: 'Popover',
        description: '弹出框组件',
        status: 'complete',
        features: ['触发方式', '位置配置', '箭头指示'],
      },
      {
        name: 'Carousel',
        description: '轮播图组件',
        status: 'complete',
        features: ['自动播放', '指示器', '箭头导航', '触摸滑动'],
      },
    ],
  },
  {
    id: 'layout',
    name: '布局组件',
    icon: '📐',
    components: [
      {
        name: 'Container',
        description: '容器组件',
        status: 'complete',
        features: ['最大宽度', '居中对齐', '内边距'],
      },
      {
        name: 'Grid',
        description: '网格布局组件',
        status: 'complete',
        features: ['响应式列', '间距配置', '对齐方式'],
      },
      {
        name: 'Flex',
        description: '弹性布局组件',
        status: 'complete',
        features: ['方向', '对齐', '换行', '间距'],
      },
      {
        name: 'Stack',
        description: '堆叠布局组件',
        status: 'complete',
        features: ['垂直/水平', '间距', '分隔线'],
      },
      {
        name: 'Spacer',
        description: '间距组件',
        status: 'complete',
        features: ['水平/垂直', '自定义大小'],
      },
      {
        name: 'Separator',
        description: '分隔线组件',
        status: 'complete',
        features: ['水平/垂直', '文本标签', '样式配置'],
      },
      {
        name: 'Panel',
        description: '面板组件',
        status: 'complete',
        features: ['可折叠', '可拖拽', '可调整大小'],
      },
    ],
  },
  {
    id: 'form',
    name: '表单组件',
    icon: '📝',
    components: [
      {
        name: 'Form',
        description: '表单容器组件',
        status: 'complete',
        features: ['验证', '提交处理', '重置', '数据绑定'],
      },
      {
        name: 'FormItem',
        description: '表单项组件',
        status: 'complete',
        features: ['标签', '错误提示', '帮助文本'],
      },
      {
        name: 'FormBuilder',
        description: '动态表单构建器',
        status: 'complete',
        features: ['JSON配置', '条件显示', '自定义验证'],
      },
      {
        name: 'DatePicker',
        description: '日期选择器',
        status: 'complete',
        features: ['单日期', '日期范围', '时间选择', '快捷选项'],
      },
      {
        name: 'TimePicker',
        description: '时间选择器',
        status: 'complete',
        features: ['12/24小时', '分钟步进', '快捷选项'],
      },
      {
        name: 'ColorPicker',
        description: '颜色选择器',
        status: 'complete',
        features: ['预设颜色', '自定义颜色', '透明度'],
      },
      {
        name: 'FileUpload',
        description: '文件上传组件',
        status: 'complete',
        features: ['拖拽上传', '预览', '进度条', '多文件'],
      },
      {
        name: 'Rating',
        description: '评分组件',
        status: 'complete',
        features: ['星级评分', '半星', '自定义图标'],
      },
      {
        name: 'Transfer',
        description: '穿梭框组件',
        status: 'complete',
        features: ['搜索', '批量操作', '排序'],
      },
    ],
  },
  {
    id: 'effects',
    name: '特效组件',
    icon: '✨',
    components: [
      {
        name: 'NeonBorder',
        description: '霓虹边框效果',
        status: 'complete',
        features: ['多种颜色', '动画效果', '强度调节'],
      },
      {
        name: 'GlitchEffect',
        description: '故障效果',
        status: 'complete',
        features: ['文字故障', '图片故障', '自定义强度'],
      },
      {
        name: 'HologramCard',
        description: '全息卡片效果',
        status: 'complete',
        features: ['3D效果', '鼠标跟随', '彩虹边框'],
      },
      {
        name: 'ParticleBackground',
        description: '粒子背景效果',
        status: 'complete',
        features: ['粒子数量', '连线距离', '鼠标交互'],
      },
      {
        name: 'Scanlines',
        description: '扫描线效果',
        status: 'complete',
        features: ['密度调节', '动画速度', '颜色配置'],
      },
      {
        name: 'TextScramble',
        description: '文字乱码效果',
        status: 'complete',
        features: ['字符集', '动画速度', '循环播放'],
      },
      {
        name: 'CursorGlow',
        description: '光标发光效果',
        status: 'complete',
        features: ['发光颜色', '影响范围', '淡出速度'],
      },
      {
        name: 'ParallaxScroll',
        description: '视差滚动效果',
        status: 'complete',
        features: ['多层视差', '速度配置', '方向控制'],
      },
    ],
  },
  {
    id: 'advanced',
    name: '高级组件',
    icon: '🚀',
    components: [
      {
        name: 'DataTable',
        description: '高级数据表格',
        status: 'complete',
        features: ['服务端排序', '虚拟滚动', '导出数据', '列配置'],
      },
      {
        name: 'InfiniteScroll',
        description: '无限滚动',
        status: 'complete',
        features: ['自动加载', '加载提示', '错误处理'],
      },
      {
        name: 'ImageGallery',
        description: '图片画廊',
        status: 'complete',
        features: ['灯箱效果', '缩放', '旋转', '下载'],
      },
      {
        name: 'VideoPlayer',
        description: '视频播放器',
        status: 'complete',
        features: ['自定义控件', '快捷键', '倍速播放'],
      },
      {
        name: 'CodeEditor',
        description: '代码编辑器',
        status: 'complete',
        features: ['语法高亮', '行号', '自动补全', '主题切换'],
      },
      {
        name: 'MarkdownEditor',
        description: 'Markdown编辑器',
        status: 'complete',
        features: ['实时预览', '工具栏', '快捷键'],
      },
      {
        name: 'TreeSelect',
        description: '树形选择器',
        status: 'complete',
        features: ['搜索', '多选', '异步加载'],
      },
      {
        name: 'Cascader',
        description: '级联选择器',
        status: 'complete',
        features: ['多级联动', '搜索', '懒加载'],
      },
    ],
  },
  {
    id: 'cyber',
    name: '赛博朋克专属',
    icon: '🌃',
    components: [
      {
        name: 'CyberButton',
        description: '赛博朋克风格按钮',
        status: 'complete',
        features: ['故障动画', '霓虹发光', '扫描线效果'],
      },
      {
        name: 'CyberCard',
        description: '赛博朋克风格卡片',
        status: 'complete',
        features: ['全息效果', '边框动画', '角标装饰'],
      },
      {
        name: 'CyberLoader',
        description: '赛博朋克风格加载器',
        status: 'complete',
        features: ['多种动画', '矩阵效果', '进度指示'],
      },
      {
        name: 'CyberInput',
        description: '赛博朋克风格输入框',
        status: 'complete',
        features: ['发光边框', '动态标签', '声音反馈'],
      },
      {
        name: 'CyberToggle',
        description: '赛博朋克风格开关',
        status: 'complete',
        features: ['动画过渡', '发光效果', '自定义图标'],
      },
      {
        name: 'CyberProgress',
        description: '赛博朋克风格进度条',
        status: 'complete',
        features: ['渐变颜色', '发光效果', '扫描线动画'],
      },
      {
        name: 'HolographicCard',
        description: '全息投影卡片',
        status: 'complete',
        features: ['3D倾斜', '彩虹边框', '透明度变化'],
      },
      {
        name: 'GlitchText',
        description: '故障文字效果',
        status: 'complete',
        features: ['随机字符', '颜色分裂', '强度控制'],
      },
    ],
  },
];
