/**
 * 博客功能 E2E 测试
 * ============================================================================
 * 功能: 使用 Playwright 测试博客功能的端到端流程
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import { test, expect, Page, BrowserContext } from '@playwright/test'

// 测试数据
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'SecurePass123!',
}

const testPost = {
  title: '测试文章标题',
  content: '这是测试文章的内容\n\n包含多个段落。',
  excerpt: '这是文章摘要',
  tags: ['React', 'TypeScript', '测试'],
}

// 辅助函数
async function login(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', testUser.email)
  await page.fill('input[name="password"]', testUser.password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
}

async function createPost(page: Page) {
  await page.goto('/admin/posts/new')
  await page.fill('input[name="title"]', testPost.title)
  await page.fill('textarea[name="content"]', testPost.content)
  await page.fill('input[name="excerpt"]', testPost.excerpt)

  // 添加标签
  for (const tag of testPost.tags) {
    await page.fill('input[placeholder*="标签"]', tag)
    await page.keyboard.press('Enter')
  }

  await page.click('button:has-text("发布")')
  await page.waitForURL(/\/blog\/.+/)
}

test.describe('博客功能 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 在每个测试前进行登录
    await login(page)
  })

  test.describe('博客列表', () => {
    test('应该显示博客列表', async ({ page }) => {
      await page.goto('/blog')

      // 验证页面标题
      await expect(page).toHaveTitle(/博客/)

      // 验证博客文章卡片存在
      const blogCards = page.locator('.blog-card')
      await expect(blogCards.first()).toBeVisible()

      // 验证分页控件
      const pagination = page.locator('.pagination')
      await expect(pagination).toBeVisible()
    })

    test('应该支持搜索功能', async ({ page }) => {
      await page.goto('/blog')

      // 输入搜索关键词
      await page.fill('input[placeholder*="搜索"]', 'React')
      await page.keyboard.press('Enter')

      // 等待搜索结果
      await page.waitForLoadState('networkidle')

      // 验证搜索结果
      const searchResults = page.locator('.blog-card')
      const count = await searchResults.count()

      // 验证URL包含搜索参数
      expect(page.url()).toContain('search=React')
    })

    test('应该支持标签筛选', async ({ page }) => {
      await page.goto('/blog')

      // 点击标签
      await page.click('text=React')

      // 等待页面加载
      await page.waitForLoadState('networkidle')

      // 验证URL包含标签参数
      expect(page.url()).toContain('tag=React')
    })

    test('应该支持分页', async ({ page }) => {
      await page.goto('/blog')

      // 点击下一页
      await page.click('text=下一页')

      // 等待页面加载
      await page.waitForLoadState('networkidle')

      // 验证URL包含页码
      expect(page.url()).toContain('page=2')
    })
  })

  test.describe('博客详情', () => {
    test('应该显示博客详情', async ({ page }) => {
      // 先创建一篇文章
      await createPost(page)

      // 验证文章内容
      await expect(page.locator('h1')).toContainText(testPost.title)
      await expect(page.locator('.blog-content')).toContainText(testPost.content)

      // 验证元信息
      await expect(page.locator('.blog-meta')).toBeVisible()
      await expect(page.locator('.blog-tags')).toBeVisible()
    })

    test('应该支持点赞功能', async ({ page }) => {
      await page.goto('/blog/test-post')

      // 获取初始点赞数
      const likeButton = page.locator('button:has-text("点赞")')
      const initialLikes = await likeButton.textContent()

      // 点击点赞
      await likeButton.click()

      // 等待请求完成
      await page.waitForLoadState('networkidle')

      // 验证点赞数增加
      const updatedLikes = await likeButton.textContent()
      expect(updatedLikes).not.toBe(initialLikes)
    })

    test('应该支持收藏功能', async ({ page }) => {
      await page.goto('/blog/test-post')

      // 点击收藏
      const bookmarkButton = page.locator('button:has-text("收藏")')
      await bookmarkButton.click()

      // 验证收藏状态变化
      await expect(bookmarkButton).toHaveClass(/active/)

      // 再次点击取消收藏
      await bookmarkButton.click()

      // 验证取消收藏
      await expect(bookmarkButton).not.toHaveClass(/active/)
    })

    test('应该支持评论功能', async ({ page }) => {
      await page.goto('/blog/test-post')

      // 滚动到评论区
      await page.locator('.comments-section').scrollIntoViewIfNeeded()

      // 输入评论
      const commentText = '这是一条测试评论'
      await page.fill('textarea[placeholder*="评论"]', commentText)

      // 提交评论
      await page.click('button:has-text("发表评论")')

      // 等待请求完成
      await page.waitForLoadState('networkidle')

      // 验证评论显示
      await expect(page.locator(`text=${commentText}`)).toBeVisible()
    })

    test('应该支持代码高亮', async ({ page }) => {
      await page.goto('/blog/code-example')

      // 验证代码块存在
      const codeBlock = page.locator('pre code')
      await expect(codeBlock).toBeVisible()

      // 验证语法高亮类名
      await expect(codeBlock).toHaveAttribute('class', /language-/)
    })

    test('应该支持分享功能', async ({ page }) => {
      await page.goto('/blog/test-post')

      // 点击分享按钮
      await page.click('button:has-text("分享")')

      // 验证分享对话框打开
      const shareDialog = page.locator('.share-dialog')
      await expect(shareDialog).toBeVisible()

      // 验证分享选项
      await expect(shareDialog.locator('text=微信')).toBeVisible()
      await expect(shareDialog.locator('text=微博')).toBeVisible()
      await expect(shareDialog.locator('text=复制链接')).toBeVisible()
    })
  })

  test.describe('博客创建', () => {
    test('应该创建新文章', async ({ page }) => {
      await page.goto('/admin/posts/new')

      // 填写表单
      await page.fill('input[name="title"]', testPost.title)
      await page.fill('textarea[name="content"]', testPost.content)
      await page.fill('input[name="excerpt"]', testPost.excerpt)

      // 添加标签
      await page.fill('input[placeholder*="标签"]', testPost.tags[0])
      await page.keyboard.press('Enter')

      // 选择分类
      await page.click('.category-dropdown')
      await page.click('text=技术')

      // 发布文章
      await page.click('button:has-text("发布")')

      // 验证跳转到文章详情页
      await page.waitForURL(/\/blog\/.+/)
      await expect(page.locator('h1')).toContainText(testPost.title)
    })

    test('应该保存草稿', async ({ page }) => {
      await page.goto('/admin/posts/new')

      // 填写部分内容
      await page.fill('input[name="title"]', '草稿文章')

      // 保存草稿
      await page.click('button:has-text("保存草稿")')

      // 验证成功消息
      await expect(page.locator('.toast-success')).toBeVisible()
    })

    test('应该上传封面图片', async ({ page }) => {
      await page.goto('/admin/posts/new')

      // 上传图片
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles('tests/fixtures/test-image.jpg')

      // 等待上传完成
      await page.waitForSelector('.image-preview')

      // 验证预览图显示
      const preview = page.locator('.image-preview img')
      await expect(preview).toBeVisible()
    })

    test('应该支持 Markdown 编辑器', async ({ page }) => {
      await page.goto('/admin/posts/new')

      // 切换到 Markdown 编辑器
      await page.click('button:has-text("Markdown")')

      // 输入 Markdown 内容
      const markdownContent = '# 标题\n\n这是**粗体**文本'
      await page.fill('.markdown-editor', markdownContent)

      // 验证实时预览
      const preview = page.locator('.markdown-preview')
      await expect(preview).toContainText('标题')
      await expect(preview.locator('strong')).toContainText('粗体')
    })

    test('应该验证必填字段', async ({ page }) => {
      await page.goto('/admin/posts/new')

      // 直接点击发布
      await page.click('button:has-text("发布")')

      // 验证错误提示
      await expect(page.locator('text=标题是必填项')).toBeVisible()
      await expect(page.locator('text=内容是必填项')).toBeVisible()
    })
  })

  test.describe('博客编辑', () => {
    test('应该编辑现有文章', async ({ page }) => {
      // 先创建文章
      await createPost(page)

      // 进入编辑模式
      await page.click('button:has-text("编辑")')

      // 修改内容
      const newTitle = '修改后的标题'
      await page.fill('input[name="title"]', newTitle)

      // 保存修改
      await page.click('button:has-text("保存")')

      // 验证修改成功
      await expect(page.locator('h1')).toContainText(newTitle)
    })

    test('应该预览文章', async ({ page }) => {
      await page.goto('/admin/posts/edit/test-post')

      // 点击预览
      await page.click('button:has-text("预览")')

      // 验证在新标签页打开预览
      const page1 = await page.context().waitForEvent('page')
      await page1.waitForLoadState()
      expect(page1.url()).toContain('/blog/')
    })
  })

  test.describe('博客删除', () => {
    test('应该删除文章', async ({ page }) => {
      // 先创建文章
      await createPost(page)

      // 点击删除
      await page.click('button:has-text("删除")')

      // 确认删除
      await page.click('.dialog button:has-text("确认")')

      // 验证跳转回博客列表
      await page.waitForURL('/blog')
      await expect(page.locator('text=文章已删除')).toBeVisible()
    })

    test('应该批量删除文章', async ({ page }) => {
      await page.goto('/admin/posts')

      // 选择多篇文章
      await page.check('.post-checkbox:first-of-type')
      await page.check('.post-checkbox:nth-of-type(2)')

      // 点击批量删除
      await page.click('button:has-text("批量删除")')

      // 确认删除
      await page.click('.dialog button:has-text("确认")')

      // 验证成功消息
      await expect(page.locator('text=已删除 2 篇文章')).toBeVisible()
    })
  })

  test.describe('博客管理', () => {
    test('应该显示文章统计', async ({ page }) => {
      await page.goto('/admin/dashboard')

      // 验证统计卡片
      await expect(page.locator('.stat-card:has-text("总文章数")')).toBeVisible()
      await expect(page.locator('.stat-card:has-text("总浏览量")')).toBeVisible()
      await expect(page.locator('.stat-card:has-text("总点赞数")')).toBeVisible()
    })

    test('应该支持文章搜索', async ({ page }) => {
      await page.goto('/admin/posts')

      // 搜索文章
      await page.fill('input[placeholder*="搜索"]', 'React')
      await page.keyboard.press('Enter')

      // 验证搜索结果
      await page.waitForLoadState('networkidle')
      const results = page.locator('.post-item')
      const count = await results.count()
      expect(count).toBeGreaterThan(0)
    })

    test('应该支持文章排序', async ({ page }) => {
      await page.goto('/admin/posts')

      // 选择排序方式
      await page.selectOption('select[name="sort"]', 'views-desc')

      // 等待页面刷新
      await page.waitForLoadState('networkidle')

      // 验证排序结果
      const postItems = page.locator('.post-item')
      const firstPostViews = await postItems.first().locator('.views').textContent()
      const lastPostViews = await postItems.last().locator('.views').textContent()

      expect(parseInt(firstPostViews!)).toBeGreaterThanOrEqual(parseInt(lastPostViews!))
    })

    test('应该支持批量操作', async ({ page }) => {
      await page.goto('/admin/posts')

      // 选择文章
      await page.check('.post-checkbox:first-of-type')
      await page.check('.post-checkbox:nth-of-type(2)')

      // 批量发布
      await page.click('button:has-text("批量发布")')

      // 验证成功消息
      await expect(page.locator('text=已发布 2 篇文章')).toBeVisible()
    })
  })

  test.describe('响应式设计', () => {
    test('应该在移动端正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/blog')

      // 验证移动端菜单
      await expect(page.locator('.mobile-menu')).toBeVisible()

      // 打开菜单
      await page.click('.mobile-menu-toggle')

      // 验证菜单项
      await expect(page.locator('text=首页')).toBeVisible()
      await expect(page.locator('text=博客')).toBeVisible()
    })

    test('应该在平板端正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/blog')

      // 验证响应式布局
      const blogCards = page.locator('.blog-card')
      await expect(blogCards.first()).toBeVisible()
    })
  })

  test.describe('性能测试', () => {
    test('应该在合理时间内加载', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/blog')
      await page.waitForLoadState('networkidle')

      const loadTime = Date.now() - startTime

      // 验证页面在3秒内加载完成
      expect(loadTime).toBeLessThan(3000)
    })

    test('应该正确缓存页面', async ({ page }) => {
      // 第一次访问
      await page.goto('/blog')
      await page.waitForLoadState('networkidle')

      // 第二次访问（应该更快）
      const startTime = Date.now()
      await page.goto('/blog')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime

      // 验证缓存生效，第二次访问更快
      expect(loadTime).toBeLessThan(1000)
    })
  })
})
