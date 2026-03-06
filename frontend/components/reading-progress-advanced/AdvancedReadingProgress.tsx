'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Clock,
  Check,
  List,
  Menu,
  X
} from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberButton } from '@/components/ui/CyberButton';

interface Chapter {
  id: string;
  title: string;
  anchor: string;
  subchapters?: Chapter[];
}

interface ReadingProgressProps {
  chapters: Chapter[];
  currentChapterId?: string;
  readingTime?: number;
}

export const AdvancedReadingProgress: React.FC<ReadingProgressProps> = ({
  chapters,
  currentChapterId,
  readingTime = 5,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Map<string, HTMLElement>>(new Map());

  // 监听滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 检测当前可见章节
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapterId = entry.target.getAttribute('data-chapter-id');
            if (chapterId) {
              setCompletedChapters(prev => new Set([...prev, chapterId]));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    chapterRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // 滚动到指定章节
  const scrollToChapter = (anchor: string) => {
    const element = document.querySelector(`[id="${anchor}"]`);
    if (element) {
      const offset = 80; // 顶部导航栏高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 切换章节展开状态
  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // 格式化阅读时间
  const formatReadingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} 分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
  };

  // 计算完成进度
  const calculateCompletion = () => {
    const totalChapters = chapters.reduce((acc, ch) => {
      let count = 1;
      if (ch.subchapters) {
        count += ch.subchapters.length;
      }
      return acc + count;
    }, 0);

    const completed = completedChapters.size;
    return totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;
  };

  const renderChapterItem = (chapter: Chapter, level: number = 0) => {
    const isExpanded = expandedChapters.has(chapter.id);
    const isCompleted = completedChapters.has(chapter.id);
    const isActive = currentChapterId === chapter.id;

    return (
      <div key={chapter.id} className={level > 0 ? 'ml-4' : ''}>
        <motion.button
          onClick={() => {
            scrollToChapter(chapter.anchor);
            if (chapter.subchapters) {
              toggleChapter(chapter.id);
            }
          }}
          className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 group ${
            isActive
              ? 'bg-cyber-cyan/10 text-cyber-cyan'
              : isCompleted
              ? 'text-green-400 hover:bg-green-400/5'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
          whileHover={{ x: 4 }}
        >
          {chapter.subchapters && chapter.subchapters.length > 0 ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}

          {isCompleted ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <BookOpen className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyber-cyan' : ''}`} />
          )}

          <span className="flex-1 truncate text-sm">{chapter.title}</span>
        </motion.button>

        {chapter.subchapters && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {chapter.subchapters.map(sub => renderChapterItem(sub, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 顶部进度条 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-900">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 桌面版侧边栏 */}
      <div className="hidden lg:block">
        <CyberCard className="sticky top-24">
          <div className="p-4 space-y-4">
            {/* 标题 */}
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <List className="w-5 h-5 text-cyber-cyan" />
                  目录导航
                </h3>
                <motion.div
                  animate={{ rotate: isExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* 阅读信息 */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatReadingTime(readingTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4" />
                      <span>{calculateCompletion()}% 完成</span>
                    </div>
                  </div>

                  {/* 章节列表 */}
                  <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {chapters.map(chapter => renderChapterItem(chapter))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CyberCard>
      </div>

      {/* 移动端菜单按钮 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <CyberButton
          variant="neon"
          size="lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </CyberButton>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end justify-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cyber-dark border-t border-cyber-cyan/50 rounded-t-3xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6">
                {/* 拖动指示器 */}
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

                {/* 标题 */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <List className="w-6 h-6 text-cyber-cyan" />
                    目录导航
                  </h3>
                  <CyberButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    关闭
                  </CyberButton>
                </div>

                {/* 阅读信息 */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{formatReadingTime(readingTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="w-5 h-5" />
                    <span>{calculateCompletion()}% 完成</span>
                  </div>
                </div>

                {/* 章节列表 */}
                <div className="space-y-1 overflow-y-auto max-h-[50vh] custom-scrollbar">
                  {chapters.map(chapter => renderChapterItem(chapter))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
