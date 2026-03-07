'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiGitCommit, FiEye, FiArrowRight, FiFileText, FiTrash2 } from 'react-icons/fi';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 文章版本历史组件
 *
 * 功能特性:
 * - 版本历史时间线
 * - 版本对比视图
 * - 变更统计
 * - 版本恢复
 * - 版本标签
 * - 变更高亮显示
 *
 * @example
 * ```tsx
 * <ArticleVersionHistory
 *   articleId="123"
 *   versions={articleVersions}
 *   onRestore={(version) => console.log('Restore:', version)}
 * />
 * ```
 */

export interface ArticleVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  changes?: {
    added?: number;
    removed?: number;
    modified?: number;
  };
  tags?: string[];
  description?: string;
}

export interface ArticleVersionHistoryProps {
  /** 文章 ID */
  articleId: string;
  /** 版本列表 */
  versions: ArticleVersion[];
  /** 是否显示完整内容 */
  showFullContent?: boolean;
  /** 版本恢复回调 */
  onRestore?: (version: ArticleVersion) => void;
  /** 版本删除回调 */
  onDelete?: (versionId: string) => void;
  /** 版本对比回调 */
  onCompare?: (fromVersion: ArticleVersion, toVersion: ArticleVersion) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
}

type ViewMode = 'timeline' | 'compare' | 'detail';

/**
 * 版本操作按钮
 */
interface VersionActionsProps {
  version: ArticleVersion;
  canRestore: boolean;
  canDelete: boolean;
  onRestore?: (version: ArticleVersion) => void;
  onDelete?: (versionId: string) => void;
  onCompare?: (version: ArticleVersion) => void;
}

const VersionActions: React.FC<VersionActionsProps> = ({
  version,
  canRestore,
  canDelete,
  onRestore,
  onDelete,
  onCompare,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {onCompare && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCompare(version)}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-colors"
          title="查看详情"
        >
          <FiEye className="w-4 h-4" />
        </motion.button>
      )}

      {canRestore && onRestore && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRestore(version)}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-cyber-green/20 hover:text-cyber-green transition-colors"
          title="恢复此版本"
        >
          <FiGitCommit className="w-4 h-4" />
        </motion.button>
      )}

      {canDelete && onDelete && version.version !== 1 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(version.id)}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-cyber-pink/20 hover:text-cyber-pink transition-colors"
          title="删除版本"
        >
          <FiTrash2 className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

/**
 * 版本卡片
 */
interface VersionCardProps {
  version: ArticleVersion;
  isActive: boolean;
  isLatest: boolean;
  showFullContent: boolean;
  onRestore?: (version: ArticleVersion) => void;
  onDelete?: (versionId: string) => void;
  onCompare?: (version: ArticleVersion) => void;
}

const VersionCard: React.FC<VersionCardProps> = ({
  version,
  isActive,
  isLatest,
  showFullContent,
  onRestore,
  onDelete,
  onCompare,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'relative p-4 rounded-lg border transition-all duration-300',
        isActive
          ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-lg shadow-cyber-cyan/20'
          : 'bg-[#1a1a2e]/50 border-gray-700 hover:border-gray-600'
      )}
    >
      {/* 版本标签 */}
      {isLatest && (
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-cyber-green text-black text-xs font-bold rounded-full">
          最新
        </div>
      )}

      {/* 版本信息 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-mono text-cyber-cyan">v{version.version}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(version.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
          <h4 className="text-white font-semibold mb-1">{version.title}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{version.author.name}</span>
            {version.description && (
              <>
                <span>•</span>
                <span className="text-gray-300">{version.description}</span>
              </>
            )}
          </div>
        </div>

        <VersionActions
          version={version}
          canRestore={!isLatest}
          canDelete={!isLatest && version.version !== 1}
          onRestore={onRestore}
          onDelete={onDelete}
          onCompare={onCompare}
        />
      </div>

      {/* 变更统计 */}
      {version.changes && (
        <div className="flex items-center space-x-3 text-xs mb-3">
          {version.changes.added !== undefined && (
            <span className="flex items-center space-x-1 text-cyber-green">
              <span>+{version.changes.added}</span>
              <span>新增</span>
            </span>
          )}
          {version.changes.modified !== undefined && (
            <span className="flex items-center space-x-1 text-cyber-yellow">
              <span>~{version.changes.modified}</span>
              <span>修改</span>
            </span>
          )}
          {version.changes.removed !== undefined && (
            <span className="flex items-center space-x-1 text-cyber-pink">
              <span>-{version.changes.removed}</span>
              <span>删除</span>
            </span>
          )}
        </div>
      )}

      {/* 标签 */}
      {version.tags && version.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {version.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 内容预览 */}
      {showFullContent && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-3 p-3 bg-[#0a0a0f] rounded text-sm text-gray-300 whitespace-pre-wrap">
            {version.content}
          </div>
        </motion.div>
      )}

      {/* 展开/收起按钮 */}
      {showFullContent && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center space-x-1 text-sm text-cyber-cyan hover:text-cyber-cyan/80"
        >
          <span>{expanded ? '收起内容' : '展开内容'}</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      )}
    </motion.div>
  );
};

/**
 * ArticleVersionHistory 主组件
 */
export const ArticleVersionHistory: React.FC<ArticleVersionHistoryProps> = ({
  articleId,
  versions,
  showFullContent = false,
  onRestore,
  onDelete,
  onCompare,
  className,
  defaultExpanded = true,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedVersions, setSelectedVersions] = useState<ArticleVersion[]>([]);
  const [expanded, setExpanded] = useState(defaultExpanded);

  /**
   * 处理版本选择
   */
  const handleVersionSelect = (version: ArticleVersion) => {
    if (selectedVersions.find(v => v.id === version.id)) {
      setSelectedVersions(prev => prev.filter(v => v.id !== version.id));
    } else {
      if (selectedVersions.length >= 2) {
        setSelectedVersions([selectedVersions[1], version]);
      } else {
        setSelectedVersions(prev => [...prev, version]);
      }
    }
  };

  /**
   * 执行版本对比
   */
  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompare) {
      onCompare(selectedVersions[0], selectedVersions[1]);
    }
  };

  return (
    <div
      className={clsx(
        'bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer bg-[#1a1a2e]/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <FiClock className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-lg font-semibold text-white">版本历史</h3>
          <span className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded">
            {versions.length} 个版本
          </span>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiArrowRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {/* 视图切换 */}
              <div className="flex items-center space-x-2 mb-6">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={clsx(
                    'px-4 py-2 rounded-lg transition-colors',
                    viewMode === 'timeline'
                      ? 'bg-cyber-cyan text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  时间线
                </button>
                {onCompare && (
                  <button
                    onClick={() => setViewMode('compare')}
                    className={clsx(
                      'px-4 py-2 rounded-lg transition-colors',
                      viewMode === 'compare'
                        ? 'bg-cyber-cyan text-black'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    )}
                  >
                    对比
                  </button>
                )}
              </div>

              {/* 时间线视图 */}
              {viewMode === 'timeline' && (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div key={version.id} className="relative">
                      {/* 时间线连接线 */}
                      {index < versions.length - 1 && (
                        <div className="absolute left-8 top-12 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan/50 to-transparent" />
                      )}

                      <VersionCard
                        version={version}
                        isActive={selectedVersions.some(v => v.id === version.id)}
                        isLatest={index === 0}
                        showFullContent={showFullContent}
                        onRestore={onRestore}
                        onDelete={onDelete}
                        onCompare={() => handleVersionSelect(version)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 对比视图 */}
              {viewMode === 'compare' && onCompare && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#1a1a2e]/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400 mb-4">
                      选择两个版本进行对比（点击版本卡片选择）
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <span className="text-sm text-gray-400">版本 1:</span>
                        <span className="ml-2 text-cyber-cyan">
                          {selectedVersions[0]?.version || '未选择'}
                        </span>
                      </div>
                      <FiArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <span className="text-sm text-gray-400">版本 2:</span>
                        <span className="ml-2 text-cyber-cyan">
                          {selectedVersions[1]?.version || '未选择'}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCompare}
                      disabled={selectedVersions.length !== 2}
                      className={clsx(
                        'mt-4 px-6 py-2 rounded-lg transition-colors',
                        selectedVersions.length === 2
                          ? 'bg-cyber-cyan text-black hover:bg-cyber-cyan/80'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      )}
                    >
                      开始对比
                    </motion.button>
                  </div>

                  {/* 可选版本列表 */}
                  <div className="space-y-2">
                    {versions.map((version) => (
                      <motion.div
                        key={version.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleVersionSelect(version)}
                        className={clsx(
                          'p-3 rounded-lg border cursor-pointer transition-colors',
                          selectedVersions.some(v => v.id === version.id)
                            ? 'bg-cyber-cyan/10 border-cyber-cyan'
                            : 'bg-[#1a1a2e]/50 border-gray-700 hover:border-gray-600'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-mono text-cyber-cyan">
                              v{version.version}
                            </span>
                            <span className="text-white">{version.title}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(version.createdAt), {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleVersionHistory;
