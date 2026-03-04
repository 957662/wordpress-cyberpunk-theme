'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pages = []
  const showPages = 5

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  let endPage = Math.min(totalPages, startPage + showPages - 1)

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="p-2 rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <Link
            href={`${basePath}?page=1`}
            className="px-4 py-2 rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
          >
            1
          </Link>
          {startPage > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`min-w-[40px] px-4 py-2 rounded-lg border transition-all ${
            page === currentPage
              ? 'bg-cyber-cyan text-cyber-dark border-cyber-cyan font-bold'
              : 'border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan'
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Link
            href={`${basePath}?page=${totalPages}`}
            className="px-4 py-2 rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="p-2 rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </nav>
  )
}
