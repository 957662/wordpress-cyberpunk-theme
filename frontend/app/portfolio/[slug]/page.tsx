'use client';

/**
 * 作品详情页面
 * Portfolio Detail Page
 */

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Github,
  ExternalLink,
  Tag,
  User,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PortfolioDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-cyber-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-cyber-muted rounded mb-4"></div>
            <div className="h-4 bg-cyber-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-cyber-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyber-cyan mb-4">作品不存在</h1>
          <Link href="/portfolio">
            <button className="px-6 py-2 border border-cyber-cyan text-cyber-cyan rounded hover:bg-cyber-cyan/10">
              返回作品集
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-cyber-cyan mb-4">作品详情页面</h1>
        <p className="text-gray-400">Slug: {slug}</p>
        <Link href="/portfolio">
          <button className="mt-4 px-6 py-2 border border-cyber-cyan text-cyber-cyan rounded hover:bg-cyber-cyan/10">
            返回作品集
          </button>
        </Link>
      </div>
    </div>
  );
}
