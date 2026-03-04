/**
 * 博客流程集成测试
 * ============================================================================
 * 功能: 测试博客相关功能的集成流程
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Mock API 服务
jest.mock('@/services/blog.service', () => ({
  BlogService: {
    getPosts: jest.fn(),
    getPostBySlug: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    likePost: jest.fn(),
    bookmarkPost: jest.fn(),
  },
}))

import { BlogService } from '@/services/blog.service'

// 测试组件
import BlogList from '@/app/blog/page'
import BlogDetail from '@/app/blog/[slug]/page'
import BlogEditor from '@/components/blog/BlogEditor'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('博客流程集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('博客列表流程', () => {
    it('应该成功加载博客列表', async () => {
      const mockPosts = [
        { id: 1, title: '第一篇文章', slug: 'first-post', excerpt: '这是第一篇' },
        { id: 2, title: '第二篇文章', slug: 'second-post', excerpt: '这是第二篇' },
      ]

      (BlogService.getPosts as jest.Mock).mockResolvedValue(mockPosts)

      renderWithProviders(<BlogList />)

      await waitFor(() => {
        expect(screen.getByText('第一篇文章')).toBeInTheDocument()
        expect(screen.getByText('第二篇文章')).toBeInTheDocument()
      })
    })

    it('应该显示加载状态', () => {
      (BlogService.getPosts as jest.Mock).mockImplementation(() => new Promise(() => {}))

      renderWithProviders(<BlogList />)

      expect(screen.getByText(/加载中/i)).toBeInTheDocument()
    })

    it('应该显示错误状态', async () => {
      (BlogService.getPosts as jest.Mock).mockRejectedValue(new Error('加载失败'))

      renderWithProviders(<BlogList />)

      await waitFor(() => {
        expect(screen.getByText(/加载失败/i)).toBeInTheDocument()
      })
    })

    it('应该支持分页', async () => {
      const mockPosts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `文章 ${i + 1}`,
        slug: `post-${i + 1}`,
        excerpt: `摘要 ${i + 1}`,
      }))

      (BlogService.getPosts as jest.Mock).mockResolvedValue(mockPosts)

      renderWithProviders(<BlogList />)

      await waitFor(() => {
        expect(screen.getByText('文章 1')).toBeInTheDocument()
      })

      // 测试分页按钮
      const nextPageButton = screen.getByText(/下一页/i)
      expect(nextPageButton).toBeInTheDocument()
    })

    it('应该支持搜索过滤', async () => {
      const mockPosts = [
        { id: 1, title: 'React 教程', slug: 'react-tutorial', excerpt: '学习 React' },
        { id: 2, title: 'Vue 教程', slug: 'vue-tutorial', excerpt: '学习 Vue' },
      ]

      (BlogService.getPosts as jest.Mock).mockResolvedValue(mockPosts)

      renderWithProviders(<BlogList />)

      await waitFor(() => {
        expect(screen.getByText('React 教程')).toBeInTheDocument()
      })

      // 测试搜索功能
      const searchInput = screen.getByPlaceholderText(/搜索/i)
      fireEvent.change(searchInput, { target: { value: 'React' } })

      await waitFor(() => {
        expect(BlogService.getPosts).toHaveBeenCalledWith(expect.objectContaining({
          search: 'React'
        }))
      })
    })
  })

  describe('博客详情流程', () => {
    it('应该成功加载博客详情', async () => {
      const mockPost = {
        id: 1,
        title: '测试文章',
        slug: 'test-post',
        content: '这是文章内容',
        author: { name: '作者', avatar: '/avatar.jpg' },
        createdAt: '2024-03-05',
        tags: ['React', 'TypeScript'],
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)

      // Mock 路由参数
      jest.mock('next/navigation', () => ({
        useParams: () => ({ slug: 'test-post' }),
      }))

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        expect(screen.getByText('测试文章')).toBeInTheDocument()
        expect(screen.getByText('这是文章内容')).toBeInTheDocument()
      })
    })

    it('应该显示文章元信息', async () => {
      const mockPost = {
        id: 1,
        title: '测试文章',
        slug: 'test-post',
        content: '内容',
        author: { name: '张三', avatar: '/avatar.jpg' },
        createdAt: '2024-03-05',
        readTime: 5,
        views: 100,
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        expect(screen.getByText('张三')).toBeInTheDocument()
        expect(screen.getByText(/5 分钟阅读/i)).toBeInTheDocument()
        expect(screen.getByText(/100 次浏览/i)).toBeInTheDocument()
      })
    })

    it('应该支持点赞功能', async () => {
      const mockPost = {
        id: 1,
        title: '测试文章',
        slug: 'test-post',
        content: '内容',
        likesCount: 10,
        isLiked: false,
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)
      (BlogService.likePost as jest.Mock).mockResolvedValue({
        ...mockPost,
        likesCount: 11,
        isLiked: true,
      })

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        const likeButton = screen.getByRole('button', { name: /点赞/i })
        fireEvent.click(likeButton)
      })

      await waitFor(() => {
        expect(BlogService.likePost).toHaveBeenCalledWith(1)
      })
    })

    it('应该支持收藏功能', async () => {
      const mockPost = {
        id: 1,
        title: '测试文章',
        slug: 'test-post',
        content: '内容',
        isBookmarked: false,
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)
      (BlogService.bookmarkPost as jest.Mock).mockResolvedValue({
        ...mockPost,
        isBookmarked: true,
      })

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        const bookmarkButton = screen.getByRole('button', { name: /收藏/i })
        fireEvent.click(bookmarkButton)
      })

      await waitFor(() => {
        expect(BlogService.bookmarkPost).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('博客编辑流程', () => {
    it('应该创建新文章', async () => {
      const newPost = {
        title: '新文章',
        content: '新文章内容',
        excerpt: '摘要',
        tags: ['React'],
      }

      (BlogService.createPost as jest.Mock).mockResolvedValue({
        id: 1,
        ...newPost,
        slug: 'new-post',
      })

      renderWithProviders(<BlogEditor />)

      // 填写表单
      const titleInput = screen.getByPlaceholderText(/文章标题/i)
      const contentInput = screen.getByPlaceholderText(/文章内容/i)

      fireEvent.change(titleInput, { target: { value: newPost.title } })
      fireEvent.change(contentInput, { target: { value: newPost.content } })

      // 提交表单
      const submitButton = screen.getByRole('button', { name: /发布/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(BlogService.createPost).toHaveBeenCalledWith(newPost)
      })
    })

    it('应该更新现有文章', async () => {
      const existingPost = {
        id: 1,
        title: '原标题',
        content: '原内容',
        slug: 'existing-post',
      }

      const updatedPost = {
        ...existingPost,
        title: '更新后的标题',
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(existingPost)
      (BlogService.updatePost as jest.Mock).mockResolvedValue(updatedPost)

      renderWithProviders(<BlogEditor slug="existing-post" />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('原标题')).toBeInTheDocument()
      })

      // 更新标题
      const titleInput = screen.getByDisplayValue('原标题')
      fireEvent.change(titleInput, { target: { value: updatedPost.title } })

      // 保存更新
      const saveButton = screen.getByRole('button', { name: /保存/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(BlogService.updatePost).toHaveBeenCalledWith(1, updatedPost)
      })
    })

    it('应该验证必填字段', async () => {
      renderWithProviders(<BlogEditor />)

      // 尝试提交空表单
      const submitButton = screen.getByRole('button', { name: /发布/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/标题是必填项/i)).toBeInTheDocument()
        expect(screen.getByText(/内容是必填项/i)).toBeInTheDocument()
      })

      expect(BlogService.createPost).not.toHaveBeenCalled()
    })
  })

  describe('博客删除流程', () => {
    it('应该删除文章', async () => {
      const mockPost = {
        id: 1,
        title: '要删除的文章',
        slug: 'to-delete',
        content: '内容',
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)
      (BlogService.deletePost as jest.Mock).mockResolvedValue(true)

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        expect(screen.getByText('要删除的文章')).toBeInTheDocument()
      })

      // 点击删除按钮
      const deleteButton = screen.getByRole('button', { name: /删除/i })
      fireEvent.click(deleteButton)

      // 确认删除
      const confirmButton = screen.getByRole('button', { name: /确认/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(BlogService.deletePost).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('博客评论流程', () => {
    it('应该加载文章评论', async () => {
      const mockPost = {
        id: 1,
        title: '测试文章',
        slug: 'test-post',
        content: '内容',
        comments: [
          { id: 1, content: '第一条评论', author: { name: '用户1' } },
          { id: 2, content: '第二条评论', author: { name: '用户2' } },
        ],
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        expect(screen.getByText('第一条评论')).toBeInTheDocument()
        expect(screen.getByText('第二条评论')).toBeInTheDocument()
      })
    })

    it('应该添加新评论', async () => {
      const mockPost = {
        id: 1,
        title: '测试文章',
        slug: 'test-post',
        content: '内容',
        comments: [],
      }

      (BlogService.getPostBySlug as jest.Mock).mockResolvedValue(mockPost)

      renderWithProviders(<BlogDetail />)

      await waitFor(() => {
        const commentInput = screen.getByPlaceholderText(/写下你的评论/i)
        fireEvent.change(commentInput, { target: { value: '这是一条新评论' } })

        const submitButton = screen.getByRole('button', { name: /发表评论/i })
        fireEvent.click(submitButton)
      })

      // 验证评论已添加
      await waitFor(() => {
        expect(screen.getByText('这是一条新评论')).toBeInTheDocument()
      })
    })
  })

  describe('博客标签流程', () => {
    it('应该按标签筛选文章', async () => {
      const reactPosts = [
        { id: 1, title: 'React 教程 1', slug: 'react-1', tags: ['React'] },
        { id: 2, title: 'React 教程 2', slug: 'react-2', tags: ['React'] },
      ]

      (BlogService.getPosts as jest.Mock).mockResolvedValue(reactPosts)

      renderWithProviders(<BlogList tag="React" />)

      await waitFor(() => {
        expect(screen.getByText('React 教程 1')).toBeInTheDocument()
        expect(screen.getByText('React 教程 2')).toBeInTheDocument()
      })

      expect(BlogService.getPosts).toHaveBeenCalledWith(expect.objectContaining({
        tags: ['React']
      }))
    })
  })

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      (BlogService.getPosts as jest.Mock).mockRejectedValue(new Error('Network Error'))

      renderWithProviders(<BlogList />)

      await waitFor(() => {
        expect(screen.getByText(/网络错误/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /重试/i })).toBeInTheDocument()
      })
    })

    it('应该支持重试功能', async () => {
      (BlogService.getPosts as jest.Mock)
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce([{ id: 1, title: '文章', slug: 'post' }])

      renderWithProviders(<BlogList />)

      // 等待错误显示
      await waitFor(() => {
        expect(screen.getByText(/网络错误/i)).toBeInTheDocument()
      })

      // 点击重试
      const retryButton = screen.getByRole('button', { name: /重试/i })
      fireEvent.click(retryButton)

      // 验证重试成功
      await waitFor(() => {
        expect(screen.getByText('文章')).toBeInTheDocument()
      })
    })
  })
})
