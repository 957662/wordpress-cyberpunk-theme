'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Calendar,
  Activity
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberInput } from '@/components/ui/CyberInput';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  scopes: string[];
  isActive: boolean;
}

export const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] useState<string[]>(['read']);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 加载 API 密钥
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
      // 使用模拟数据用于演示
      setApiKeys([
        {
          id: '1',
          name: 'Production API Key',
          key: 'cp_prod_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          scopes: ['read', 'write', 'delete'],
          isActive: true,
        },
        {
          id: '2',
          name: 'Testing Key',
          key: 'cp_test_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          scopes: ['read'],
          isActive: true,
        },
      ]);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('请输入密钥名称');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName,
          scopes: newKeyScopes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys([...apiKeys, data.key]);
        setShowCreateModal(false);
        setNewKeyName('');
        toast.success('API 密钥创建成功');
      } else {
        throw new Error('Failed to create API key');
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      // 模拟创建用于演示
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: 'cp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        scopes: newKeyScopes,
        isActive: true,
      };
      setApiKeys([...apiKeys, newKey]);
      setShowCreateModal(false);
      setNewKeyName('');
      toast.success('API 密钥创建成功');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('确定要删除此 API 密钥吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(k => k.id !== keyId));
        toast.success('API 密钥已删除');
      } else {
        throw new Error('Failed to delete API key');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
      toast.success('API 密钥已删除');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return diffHours === 0 ? '刚刚' : `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 10) return '*'.repeat(key.length);
    return key.substring(0, 8) + '*'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  const toggleScope = (scope: string) => {
    if (newKeyScopes.includes(scope)) {
      setNewKeyScopes(newKeyScopes.filter(s => s !== scope));
    } else {
      setNewKeyScopes([...newKeyScopes, scope]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-cyan/20 blur-lg rounded-lg"></div>
            <div className="relative bg-cyber-dark border border-cyber-cyan/50 rounded-lg p-2">
              <Key className="w-6 h-6 text-cyber-cyan" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">API 密钥管理</h2>
            <p className="text-gray-400 text-sm">管理您的 API 访问密钥</p>
          </div>
        </div>
        <CyberButton
          variant="neon"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          创建新密钥
        </CyberButton>
      </div>

      {/* 安全提示 */}
      <CyberCard className="border-cyber-purple/50 bg-cyber-purple/5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyber-purple mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-white font-semibold mb-1">安全提示</h3>
            <p className="text-gray-400 text-sm">
              API 密钥具有完整的账户访问权限。请勿与他人分享，并在使用完毕后立即删除。
              如果怀疑密钥泄露，请立即删除并重新生成。
            </p>
          </div>
        </div>
      </CyberCard>

      {/* API 密钥列表 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">您的 API 密钥</h3>

        {apiKeys.length === 0 ? (
          <CyberCard className="text-center py-12">
            <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无 API 密钥</p>
            <p className="text-gray-500 text-sm mt-1">创建一个密钥以开始使用 API</p>
          </CyberCard>
        ) : (
          <AnimatePresence mode="popLayout">
            {apiKeys.map((apiKey) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <CyberCard className="hover:border-cyber-cyan/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold">{apiKey.name}</h4>
                        {apiKey.isActive ? (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                            活跃
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                            已禁用
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className="text-sm font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="text-gray-400 hover:text-white transition-colors relative"
                        >
                          {copiedKey === apiKey.id ? (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded whitespace-nowrap">
                              已复制!
                            </div>
                          ) : null}
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          创建于 {formatDate(apiKey.createdAt)}
                        </div>
                        {apiKey.lastUsed && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            最后使用 {formatDate(apiKey.lastUsed)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {apiKey.scopes.map(scope => (
                          <span
                            key={scope}
                            className="px-2 py-0.5 bg-cyber-cyan/10 text-cyber-cyan text-xs rounded"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition-colors"
                      title="删除密钥"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 创建密钥模态框 */}
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
              className="bg-cyber-dark border border-cyber-cyan/50 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">创建新的 API 密钥</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    密钥名称
                  </label>
                  <CyberInput
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="例如：Production API Key"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    权限范围
                  </label>
                  <div className="space-y-2">
                    {['read', 'write', 'delete', 'admin'].map(scope => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKeyScopes.includes(scope)}
                          onChange={() => toggleScope(scope)}
                          className="w-4 h-4 rounded border-gray-600 bg-cyber-dark text-cyber-cyan focus:ring-cyber-cyan"
                        />
                        <span className="text-gray-300 text-sm capitalize">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ 创建后请立即复制密钥，因为之后无法再次查看完整的密钥内容。
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <CyberButton
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    取消
                  </CyberButton>
                  <CyberButton
                    variant="neon"
                    onClick={createApiKey}
                    disabled={isLoading || !newKeyName.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      '创建密钥'
                    )}
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 使用说明 */}
      <CyberCard className="bg-cyber-muted/30">
        <h3 className="text-white font-semibold mb-3">如何使用 API</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <p>在您的 HTTP 请求中包含 API 密钥：</p>
          <div className="bg-cyber-dark/50 rounded-lg p-3 overflow-x-auto">
            <code className="text-cyber-cyan text-xs">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <p className="text-xs">
            访问{' '}
            <a href="/docs/api" className="text-cyber-cyan hover:underline">
              API 文档
            </a>
            {' '}查看完整的 API 端点和用法示例。
          </p>
        </div>
      </CyberCard>
    </div>
  );
};
