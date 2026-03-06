'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Download,
  Upload,
  Clock,
  HardDrive,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  FileArchive,
  Calendar
} from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberButton } from '@/components/ui/CyberButton';
import toast from 'react-hot-toast';

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'full' | 'partial';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      name: '完整备份 - 2024-03-01',
      date: '2024-03-01 03:00',
      size: '245 MB',
      type: 'full',
      status: 'completed',
      description: '包含所有文章、用户数据和设置',
    },
    {
      id: '2',
      name: '增量备份 - 2024-03-05',
      date: '2024-03-05 03:00',
      size: '12 MB',
      type: 'partial',
      status: 'completed',
      description: '仅包含自上次备份以来的变更',
    },
  ]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [backupName, setBackupName] = useState('');
  const [backupType, setBackupType] = useState<'full' | 'partial'>('full');

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      toast.error('请输入备份名称');
      return;
    }

    setIsCreatingBackup(true);
    setShowCreateModal(false);

    // 模拟创建备份
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newBackup: Backup = {
      id: Date.now().toString(),
      name: backupName,
      date: new Date().toLocaleString('zh-CN'),
      size: Math.round(Math.random() * 200 + 10) + ' MB',
      type: backupType,
      status: 'completed',
      description: backupType === 'full' ? '完整系统备份' : '增量备份',
    };

    setBackups([newBackup, ...backups]);
    setBackupName('');
    setIsCreatingBackup(false);
    toast.success('备份创建成功');
  };

  const handleRestore = async (backup: Backup) => {
    if (!confirm(`确定要恢复备份 "${backup.name}" 吗？\n\n这将覆盖当前数据，此操作不可撤销。`)) {
      return;
    }

    setIsRestoring(true);
    setSelectedBackup(backup);

    // 模拟恢复过程
    await new Promise(resolve => setTimeout(resolve, 5000));

    setIsRestoring(false);
    setSelectedBackup(null);
    toast.success('备份恢复成功');
  };

  const handleDelete = async (backupId: string) => {
    if (!confirm('确定要删除此备份吗？此操作不可撤销。')) {
      return;
    }

    setBackups(backups.filter(b => b.id !== backupId));
    toast.success('备份已删除');
  };

  const handleDownload = async (backup: Backup) => {
    toast.loading('准备下载...', { id: 'download' });

    // 模拟下载准备
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 创建模拟备份文件
    const backupData = {
      version: '1.0',
      name: backup.name,
      date: backup.date,
      type: backup.type,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${backup.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('下载完成', { id: 'download' });
  };

  const calculateTotalSize = () => {
    return backups.reduce((total, backup) => {
      const size = parseFloat(backup.size);
      return total + size;
    }, 0);
  };

  const getTypeColor = (type: Backup['type']) => {
    return type === 'full'
      ? 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30'
      : 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/30';
  };

  const getTypeLabel = (type: Backup['type']) => {
    return type === 'full' ? '完整备份' : '增量备份';
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/20 blur-lg rounded-lg"></div>
            <div className="relative bg-cyber-dark border border-green-400/50 rounded-lg p-2">
              <Database className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">数据备份</h2>
            <p className="text-gray-400 text-sm">管理您的数据备份和恢复</p>
          </div>
        </div>

        <CyberButton
          variant="neon"
          onClick={() => setShowCreateModal(true)}
          disabled={isCreatingBackup}
          className="gap-2"
        >
          {isCreatingBackup ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              创建中...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              创建备份
            </>
          )}
        </CyberButton>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileArchive className="w-5 h-5 text-cyber-cyan" />
              <span className="text-gray-400 text-sm">总备份大小</span>
            </div>
            <p className="text-2xl font-bold text-white">{calculateTotalSize().toFixed(0)} MB</p>
          </div>
        </CyberCard>

        <CyberCard>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-cyber-purple" />
              <span className="text-gray-400 text-sm">备份数量</span>
            </div>
            <p className="text-2xl font-bold text-white">{backups.length}</p>
          </div>
        </CyberCard>

        <CyberCard>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-cyber-pink" />
              <span className="text-gray-400 text-sm">最新备份</span>
            </div>
            <p className="text-lg font-bold text-white">
              {backups.length > 0 ? backups[0].date.split(' ')[0] : '无'}
            </p>
          </div>
        </CyberCard>
      </div>

      {/* 警告提示 */}
      <CyberCard className="border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-white font-semibold mb-1">重要提示</h3>
            <p className="text-gray-400 text-sm">
              定期备份数据可以保护您的内容免受意外丢失。建议每周至少创建一次完整备份。
              恢复备份将覆盖当前数据，请谨慎操作。
            </p>
          </div>
        </div>
      </CyberCard>

      {/* 备份列表 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">备份历史</h3>

        {backups.length === 0 ? (
          <CyberCard className="text-center py-12">
            <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无备份</p>
            <p className="text-gray-500 text-sm mt-1">点击上方按钮创建第一个备份</p>
          </CyberCard>
        ) : (
          <div className="space-y-4">
            {backups.map((backup) => (
              <motion.div
                key={backup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CyberCard className="hover:border-green-400/50 transition-colors">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* 备份信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-semibold">{backup.name}</h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full border ${getTypeColor(
                              backup.type
                            )}`}
                          >
                            {getTypeLabel(backup.type)}
                          </span>
                          {backup.status === 'completed' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              已完成
                            </span>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm mb-3">{backup.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {backup.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {backup.size}
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(backup)}
                          className="p-2 text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                          title="下载"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestore(backup)}
                          disabled={isRestoring}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="恢复"
                        >
                          {isRestoring && selectedBackup?.id === backup.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(backup.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="删除"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 创建备份模态框 */}
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
              <h3 className="text-xl font-bold text-white mb-6">创建新备份</h3>

              <div className="space-y-4">
                {/* 备份名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    备份名称
                  </label>
                  <input
                    type="text"
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                    placeholder="例如：每周备份 - 2024-03-06"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                  />
                </div>

                {/* 备份类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    备份类型
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer hover:border-cyber-cyan/50 transition-colors">
                      <input
                        type="radio"
                        name="backupType"
                        value="full"
                        checked={backupType === 'full'}
                        onChange={(e) => setBackupType(e.target.value as 'full' | 'partial')}
                        className="w-4 h-4 text-cyber-cyan"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">完整备份</p>
                        <p className="text-gray-400 text-xs">备份所有数据，包括文章、用户、设置等</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer hover:border-cyber-cyan/50 transition-colors">
                      <input
                        type="radio"
                        name="backupType"
                        value="partial"
                        checked={backupType === 'partial'}
                        onChange={(e) => setBackupType(e.target.value as 'full' | 'partial')}
                        className="w-4 h-4 text-cyber-cyan"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">增量备份</p>
                        <p className="text-gray-400 text-xs">仅备份自上次以来的变更</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 预估大小 */}
                {backupName && (
                  <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
                    <p className="text-cyber-cyan text-sm">
                      预估大小: {backupType === 'full' ? '200-300 MB' : '10-50 MB'}
                    </p>
                  </div>
                )}

                {/* 按钮 */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <CyberButton
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    取消
                  </CyberButton>
                  <CyberButton
                    variant="neon"
                    onClick={handleCreateBackup}
                    disabled={!backupName.trim()}
                    className="flex-1"
                  >
                    创建备份
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 恢复进度 */}
      <AnimatePresence>
        {isRestoring && selectedBackup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cyber-dark border border-cyber-cyan/50 rounded-lg p-8 max-w-md w-full text-center"
            >
              <RefreshCw className="w-12 h-12 text-cyber-cyan mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-white mb-2">正在恢复备份</h3>
              <p className="text-gray-400 mb-4">{selectedBackup.name}</p>
              <p className="text-sm text-gray-500">请勿关闭浏览器，恢复过程可能需要几分钟...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
