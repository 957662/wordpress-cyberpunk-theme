'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { usePosts, useCategories } from '@/hooks/usePosts'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/blog/Pagination'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function BlogPage() {
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const categoryFilter = searchParams.get('category')
  const searchQuery = searchParams.get('search') || ''

  const { data: postsData, isLoading: postsLoading } = usePosts({
    page,
    perPage: 9,
    search: searchQuery || undefined,
    ...(categoryFilter && { categories: [parseInt(categoryFilter)] }),
  })

  const { data: categories } = useCategories()

  const posts = postsData?.data || []
  const totalPages = postsData?.totalPages || 1

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-20 px-4 border-b border-cyber-border bg-gradient-to-b from-cyber-muted/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                <span className="text-glow-cyan text-cyber-cyan">技术</span>
                <span className="text-white">博客</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                探索最新的开发技术、设计趋势和创新思维
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 px-4 border-b border-cyber-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="search"
                  placeholder="搜索文章..."
                  className="w-full pl-10 pr-4 py-2 bg-cyber-muted border border-cyber-border rounded-lg focus:border-cyber-cyan focus:outline-none text-white placeholder-gray-500 transition-colors"
                  defaultValue={searchQuery}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value
                      window.location.href = `/blog?search=${query}`
                    }
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (categoryFilter) {
                        window.location.href = '/blog'
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      !categoryFilter
                        ? 'bg-cyber-cyan text-cyber-dark font-bold'
                        : 'bg-cyber-muted text-gray-400 hover:text-white'
                    }`}
                  >
                    全部
                  </button>
                  {categories?.slice(0, 5).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        window.location.href = `/blog?category=${category.id}`
                      }}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        categoryFilter === String(category.id)
                          ? 'bg-cyber-cyan text-cyber-dark font-bold'
                          : 'bg-cyber-muted text-gray-400 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {postsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="cyber-card animate-pulse">
                    <div className="aspect-video bg-cyber-muted rounded-lg mb-4" />
                    <div className="h-4 bg-cyber-muted rounded w-1/3 mb-3" />
                    <div className="h-6 bg-cyber-muted rounded w-3/4 mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-cyber-muted rounded" />
                      <div className="h-4 bg-cyber-muted rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    basePath="/blog"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">没有找到相关文章</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
