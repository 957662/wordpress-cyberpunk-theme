'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Plus,
  Send,
  Edit,
  Trash2,
  Users,
  Open,
  Click,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberButton } from '@/components/ui/CyberButton';
import toast from 'react-hot-toast';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  recipients: number;
  openRate: number;
  clickRate: number;
  sentDate?: string;
  scheduledDate?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

export const EmailCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: '每周精选 - 第12期',
      subject: '本周热门文章推荐',
      status: 'sent',
      recipients: 1234,
      openRate: 45.2,
      clickRate: 12.8,
      sentDate: '2024-03-01',
    },
    {
      id: '2',
      name: '新功能公告',
      subject: '探索 CyberPress 的新功能',
      status: 'scheduled',
      recipients: 2500,
      openRate: 0,
      clickRate: 0,
      scheduledDate: '2024-03-10',
    },
    {
      id: '3',
      name: '产品更新通知',
      subject: '2024年3月产品更新',
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
    },
  ]);

  const [templates] = useState<EmailTemplate[]>([
    { id: '1', name: '每周摘要', thumbnail: '📰', category: '常规' },
    { id: '2', name: '新品推荐', thumbnail: '🎉', category: '推广' },
    { id: '3', name: '活动通知', thumbnail: '📅', category: '活动' },
    { id: '4', name: '欢迎邮件', thumbnail: '👋', category: '欢迎' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [selectedTab, setSelectedTab] = useState<'campaigns' | 'templates' | 'analytics'>('campaigns');

  // 新建营销邮件表单
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    recipients: '',
    scheduledDate: '',
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) {
      toast.error('请填写必填字段');
      return;
    }

    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
    };

    setCampaigns([campaign, ...campaigns]);
    setShowCreateModal(false);
    resetForm();
    toast.success('营销邮件创建成功');
  };

  const handleSendCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    if (!confirm(`确定要发送 "${campaign.name}" 吗？`)) return;

    setCampaigns(
      campaigns.map((c) =>
        c.id === campaignId ? { ...c, status: 'sending' } : c
      )
    );

    // 模拟发送
    await new Promise(resolve => setTimeout(resolve, 3000));

    setCampaigns(
      campaigns.map((c) =>
        c.id === campaignId
          ? { ...c, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
          : c
      )
    );

    toast.success('邮件发送成功');
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (!confirm('确定要删除这个营销邮件吗？')) return;
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    toast.success('已删除');
  };

  const resetForm = () => {
    setNewCampaign({
      name: '',
      subject: '',
      recipients: '',
      scheduledDate: '',
    });
  };

  const getStatusColor = (status: EmailCampaign['status']) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      sent: 'bg-green-500/20 text-green-400 border-green-500/30',
      sending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[status];
  };

  const getStatusLabel = (status: EmailCampaign['status']) => {
    const labels = {
      draft: '草稿',
      scheduled: '已排期',
      sent: '已发送',
      sending: '发送中',
    };
    return labels[status];
  };

  const calculateTotalRecipients = () => {
    return campaigns.reduce((total, c) => total + c.recipients, 0);
  };

  const calculateAverageOpenRate = () => {
    const sentCampaigns = campaigns.filter(c => c.status === 'sent' && c.openRate > 0);
    if (sentCampaigns.length === 0) return 0;
    const total = sentCampaigns.reduce((sum, c) => sum + c.openRate, 0);
    return total / sentCampaigns.length;
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-pink/20 blur-lg rounded-lg"></div>
            <div className="relative bg-cyber-dark border border-cyber-pink/50 rounded-lg p-2">
              <Mail className="w-6 h-6 text-cyber-pink" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">邮件营销</h2>
            <p className="text-gray-400 text-sm">管理您的邮件营销活动</p>
          </div>
        </div>

        <CyberButton
          variant="neon"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          创建邮件
        </CyberButton>
      </div>

      {/* 标签切换 */}
      <div className="flex items-center gap-4 border-b border-gray-800">
        {([
          { id: 'campaigns', label: '营销活动', icon: Mail },
          { id: 'templates', label: '邮件模板', icon: Edit },
          { id: 'analytics', label: '数据分析', icon: TrendingUp },
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                selectedTab === tab.id
                  ? 'text-cyber-pink'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {selectedTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-pink"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CyberCard>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-cyber-cyan" />
                    <span className="text-gray-400 text-sm">总收件人</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {calculateTotalRecipients().toLocaleString()}
                  </p>
                </div>
              </CyberCard>

              <CyberCard>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Open className="w-5 h-5 text-cyber-purple" />
                    <span className="text-gray-400 text-sm">平均打开率</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {calculateAverageOpenRate().toFixed(1)}%
                  </p>
                </div>
              </CyberCard>

              <CyberCard>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Send className="w-5 h-5 text-cyber-pink" />
                    <span className="text-gray-400 text-sm">已发送</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {campaigns.filter(c => c.status === 'sent').length}
                  </p>
                </div>
              </CyberCard>
            </div>

            {/* 营销活动列表 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">营销活动</h3>

              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <CyberCard className="hover:border-cyber-pink/50 transition-colors">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white font-semibold truncate">
                              {campaign.name}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full border flex-shrink-0 ${getStatusColor(
                                campaign.status
                              )}`}
                            >
                              {getStatusLabel(campaign.status)}
                            </span>
                          </div>

                          <p className="text-gray-400 text-sm mb-3">{campaign.subject}</p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {campaign.recipients} 收件人
                            </div>
                            {campaign.status === 'sent' && campaign.openRate > 0 && (
                              <>
                                <div className="flex items-center gap-1">
                                  <Open className="w-3 h-3" />
                                  打开率 {campaign.openRate}%
                                </div>
                                <div className="flex items-center gap-1">
                                  <Click className="w-3 h-3" />
                                  点击率 {campaign.clickRate}%
                                </div>
                              </>
                            )}
                            {(campaign.sentDate || campaign.scheduledDate) && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {campaign.sentDate || campaign.scheduledDate}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 操作 */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="p-2 text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                              title="发送"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingCampaign(campaign)}
                            className="p-2 text-gray-400 hover:text-cyber-purple hover:bg-cyber-purple/10 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CyberCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <CyberCard
                  key={template.id}
                  className="hover:border-cyber-pink/50 hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-3">{template.thumbnail}</div>
                    <h4 className="text-white font-semibold mb-1">{template.name}</h4>
                    <p className="text-gray-500 text-xs mb-4">{template.category}</p>
                    <CyberButton variant="outline" size="sm" className="w-full">
                      使用模板
                    </CyberButton>
                  </div>
                </CyberCard>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CyberCard className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">数据分析</h3>
              <p className="text-gray-400">详细的邮件营销数据分析即将推出</p>
            </CyberCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 创建邮件模态框 */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cyber-dark border border-cyber-pink/50 rounded-lg p-6 max-w-2xl w-full"
            >
              <h3 className="text-xl font-bold text-white mb-6">创建营销邮件</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    邮件名称 *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="例如：每周精选 - 第13期"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-cyber-pink focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    邮件主题 *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    placeholder="输入邮件主题"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-cyber-pink focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <CyberButton
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    取消
                  </CyberButton>
                  <CyberButton
                    variant="neon"
                    onClick={handleCreateCampaign}
                    disabled={!newCampaign.name || !newCampaign.subject}
                    className="flex-1"
                  >
                    创建
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
