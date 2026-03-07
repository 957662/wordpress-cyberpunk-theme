'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime?: string;
  slug?: string;
}

interface ArticleListProps {
  posts: Article[];
}

export function ArticleList({ posts }: ArticleListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-lg border border-cyber-border bg-cyber-card hover:border-cyber-cyan transition-all duration-300 hover:shadow-lg hover:shadow-cyber-cyan/20"
        >
          <Link href={`/blog/${post.slug || post.id}`} className="block p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-mono rounded-full bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="w-6 h-6 bg-cyber-cyan/20 rounded-full flex items-center justify-center text-xs text-cyber-cyan">
                      {post.author.charAt(0)}
                    </span>
                    {post.author}
                  </span>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-cyber-cyan/10 rounded-lg flex items-center justify-center group-hover:bg-cyber-cyan/20 transition-colors">
                  <ArrowRight className="w-5 h-5 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
