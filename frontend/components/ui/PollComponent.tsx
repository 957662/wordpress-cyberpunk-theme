/**
 * 投票组件
 * 支持单选、多选投票，实时显示结果
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PollOption {
  id: string;
  text: string;
  votes?: number;
  color?: string;
}

export interface PollComponentProps {
  id: string;
  question: string;
  options: PollOption[];
  type?: 'single' | 'multiple';
  allowMultiple?: boolean;
  showResults?: boolean;
  totalVotes?: number;
  hasVoted?: boolean;
  onVote?: (optionIds: string[]) => void;
  className?: string;
}

export function PollComponent({
  id,
  question,
  options,
  type = 'single',
  allowMultiple = false,
  showResults = false,
  totalVotes = 0,
  hasVoted = false,
  onVote,
  className,
}: PollComponentProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [voted, setVoted] = useState(hasVoted);
  const [results, setResults] = useState<PollOption[]>(options);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setResults(options);
  }, [options]);

  useEffect(() => {
    setVoted(hasVoted);
  }, [hasVoted]);

  const handleOptionClick = (optionId: string) => {
    if (voted) return;

    if (type === 'single') {
      setSelectedOptions([optionId]);
    } else if (allowMultiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0 || voted) return;

    setVoted(true);
    setAnimation(true);

    // 更新结果
    const newResults = results.map(option => ({
      ...option,
      votes: (option.votes || 0) + (selectedOptions.includes(option.id) ? 1 : 0),
    }));
    setResults(newResults);

    onVote?.(selectedOptions);
  };

  const getPercentage = (votes: number = 0) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getTotalVotes = () => {
    return results.reduce((sum, option) => sum + (option.votes || 0), 0);
  };

  const defaultColors = [
    'bg-cyber-cyan',
    'bg-cyber-purple',
    'bg-cyber-pink',
    'bg-cyber-green',
    'bg-cyber-yellow',
  ];

  return (
    <div className={cn('backdrop-blur-md rounded-xl border-2 border-cyber-purple/30 p-6', className)}>
      <h3 className="text-xl font-bold mb-4">{question}</h3>

      <div className="space-y-3">
        <AnimatePresence>
          {results.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id);
            const percentage = getPercentage(option.votes);
            const color = option.color || defaultColors[index % defaultColors.length];
            const showResultBars = voted || showResults;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleOptionClick(option.id)}
                  disabled={voted}
                  className={cn(
                    'w-full relative overflow-hidden rounded-lg p-4 text-left',
                    'transition-all duration-200 border-2',
                    'disabled:cursor-not-allowed',
                    isSelected && !voted
                      ? 'border-cyber-cyan bg-cyber-cyan/10'
                      : 'border-cyber-purple/30 bg-cyber-purple/5 hover:border-cyber-purple/50',
                    voted && 'cursor-default'
                  )}
                >
                  {/* 结果条 */}
                  {showResultBars && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn(
                        'absolute inset-0 opacity-20',
                        color
                      )}
                    />
                  )}

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* 选择指示器 */}
                      {!voted && (
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                            type === 'single' ? 'border-cyber-cyan' : 'border-cyber-purple'
                          )}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={cn(
                                'w-3 h-3 rounded-full',
                                type === 'single' ? 'bg-cyber-cyan' : 'bg-cyber-purple'
                              )}
                            />
                          )}
                        </div>
                      )}

                      {/* 选项文本 */}
                      <span className={cn('font-medium', isSelected && !voted && 'text-cyber-cyan')}>
                        {option.text}
                      </span>
                    </div>

                    {/* 票数和百分比 */}
                    {showResultBars && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-400">{option.votes || 0} 票</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={cn('font-bold', color.replace('bg-', 'text-'))}
                        >
                          {percentage}%
                        </motion.span>
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 投票按钮 */}
      {!voted && selectedOptions.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleVote}
          className="mt-4 w-full py-3 bg-cyber-cyan text-cyber-dark font-semibold rounded-lg hover:bg-cyber-cyan/90 transition-colors"
        >
          提交投票
        </motion.button>
      )}

      {/* 总票数 */}
      {(voted || showResults) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-gray-400"
        >
          总计 {getTotalVotes()} 票
        </motion.div>
      )}
    </div>
  );
}

// 投票列表组件
export interface PollListProps {
  polls: Array<{
    id: string;
    question: string;
    options: PollOption[];
    type?: 'single' | 'multiple';
  }>;
  onVote?: (pollId: string, optionIds: string[]) => void;
  className?: string;
}

export function PollList({ polls, onVote, className }: PollListProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {polls.map(poll => (
        <PollComponent
          key={poll.id}
          {...poll}
          onVote={(optionIds) => onVote?.(poll.id, optionIds)}
        />
      ))}
    </div>
  );
}

// 投票结果组件
export interface PollResultsProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  winner?: string;
  className?: string;
}

export function PollResults({ question, options, totalVotes, winner, className }: PollResultsProps) {
  return (
    <div className={cn('backdrop-blur-md rounded-xl border-2 border-cyber-purple/30 p-6', className)}>
      <h3 className="text-xl font-bold mb-4">{question}</h3>

      <div className="space-y-3">
        {options.map((option, index) => {
          const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
          const isWinner = winner && option.id === winner;

          return (
            <div key={option.id} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className={cn('font-medium', isWinner && 'text-cyber-cyan')}>
                  {option.text}
                  {isWinner && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-xs bg-cyber-cyan text-cyber-dark px-2 py-0.5 rounded-full"
                    >
                      第一名
                    </motion.span>
                  )}
                </span>
                <span className="text-sm text-gray-400">
                  {option.votes || 0} 票 ({percentage}%)
                </span>
              </div>

              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full',
                    isWinner ? 'bg-cyber-cyan shadow-neon-cyan' : 'bg-cyber-purple'
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        总计 {totalVotes} 票
      </div>
    </div>
  );
}
