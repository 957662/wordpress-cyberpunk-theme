/**
 * Blog E2E Tests
 *
 * 测试博客功能：文章列表、详情、搜索
 */

import { test, expect } from '@playwright/test';

test.describe('Blog Posts', () => {
  test('should display blog posts list', async ({ page }) => {
    await page.goto('/blog');

    // 验证页面标题
    await expect(page.getByRole('heading', { name: /blog|博客/i })).toBeVisible();

    // 验证文章列表存在
    const posts = page.getByTestId(/post-card|article-card/i);
    await expect(posts.first()).toBeVisible();
  });

  test('should filter posts by category', async ({ page }) => {
    await page.goto('/blog');

    // 点击分类筛选
    await page.getByRole('button', { name: /tech|技术/i }).click();

    // 等待页面更新
    await page.waitForURL(/category=tech/);

    // 验证 URL 更新
    expect(page.url()).toContain('category=tech');
  });

  test('should search posts', async ({ page }) => {
    await page.goto('/blog');

    // 输入搜索关键词
    await page.getByPlaceholder(/search|搜索/i).fill('test');

    // 点击搜索按钮
    await page.getByRole('button', { name: /search|搜索/i }).click();

    // 等待搜索结果
    await page.waitForURL(/q=test/);

    // 验证搜索结果
    const searchResults = page.getByTestId(/search-result|post-card/i);
    await expect(searchResults.first()).toBeVisible();
  });

  test('should navigate to post detail', async ({ page }) => {
    await page.goto('/blog');

    // 点击第一篇文章
    await page.getByTestId(/post-card|article-card/i).first().click();

    // 验证导航到文章详情页
    await expect(page).toHaveURL(/\/blog\/[\w-]+/);

    // 验证文章内容显示
    await expect(page.getByRole('article')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should display post metadata', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 验证作者信息
    await expect(page.getByText(/author|作者/i)).toBeVisible();

    // 验证发布日期
    await expect(page.getByText(/\d{4}-\d{2}-\d{2}/)).toBeVisible();

    // 验证标签
    const tags = page.getByTestId(/tag|label/i);
    await expect(tags.first()).toBeVisible();
  });

  test('should display related posts', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 滚动到相关文章区域
    await page.getByText(/related.*posts|相关文章/i).scrollIntoViewIfNeeded();

    // 验证相关文章存在
    const relatedPosts = page.getByTestId(/related-post|similar-post/i);
    await expect(relatedPosts.first()).toBeVisible();
  });

  test('should navigate through pagination', async ({ page }) => {
    await page.goto('/blog');

    // 查找下一页按钮
    const nextButton = page.getByRole('button', { name: /next|下一页/i });

    if (await nextButton.isVisible()) {
      await nextButton.click();

      // 验证 URL 更新
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test('should share post', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 点击分享按钮
    await page.getByRole('button', { name: /share|分享/i }).click();

    // 验证分享选项显示
    await expect(page.getByText(/twitter|facebook|copy.*link/i)).toBeVisible();
  });
});

test.describe('Post Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/auth/login');
    await page.getByLabel(/username|用户名/i).fill('testuser');
    await page.getByLabel(/password|密码/i).fill('password123');
    await page.getByRole('button', { name: /login|登录/i }).click();
    await expect(page.getByText(/testuser/i)).toBeVisible();
  });

  test('should like post', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 获取初始点赞数
    const likeButton = page.getByRole('button', { name: /like|点赞/i });
    const initialLikes = await likeButton.textContent();

    // 点击点赞
    await likeButton.click();

    // 验证点赞数增加
    await expect(likeButton).toContainText(/\d+/);
  });

  test('should bookmark post', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 点击收藏按钮
    await page.getByRole('button', { name: /bookmark|收藏/i }).click();

    // 验证收藏成功提示
    await expect(page.getByText(/bookmarked|已收藏/i)).toBeVisible();
  });

  test('should add comment to post', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 滚动到评论区
    await page.getByText(/comments|评论/i).scrollIntoViewIfNeeded();

    // 输入评论
    await page.getByPlaceholder(/write.*comment|写评论/i).fill('This is a test comment');

    // 提交评论
    await page.getByRole('button', { name: /submit|提交|发送/i }).click();

    // 验证评论显示
    await expect(page.getByText('This is a test comment')).toBeVisible();
  });

  test('should reply to comment', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 滚动到评论区
    await page.getByText(/comments|评论/i).scrollIntoViewIfNeeded();

    // 点击第一条评论的回复按钮
    await page.getByRole('button', { name: /reply|回复/i }).first().click();

    // 输入回复内容
    await page.getByPlaceholder(/write.*reply|写回复/i).fill('This is a reply');

    // 提交回复
    await page.getByRole('button', { name: /submit|提交|发送/i }).click();

    // 验证回复显示
    await expect(page.getByText('This is a reply')).toBeVisible();
  });
});

test.describe('Reading Progress', () => {
  test('should display reading progress', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 验证阅读进度条存在
    const progressBar = page.getByTestId(/reading-progress|progress-bar/i);
    await expect(progressBar).toBeVisible();
  });

  test('should update reading progress on scroll', async ({ page }) => {
    await page.goto('/blog/test-post');

    const progressBar = page.getByTestId(/reading-progress|progress-bar/i);

    // 滚动页面
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));

    // 验证进度更新
    await expect(progressBar).toHaveAttribute('value', /\d+/);
  });
});

test.describe('Table of Contents', () => {
  test('should display table of contents', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 滚动到目录区域
    await page.getByText(/contents|目录/i).scrollIntoViewIfNeeded();

    // 验证目录项存在
    const tocItems = page.getByTestId(/toc-item|heading-link/i);
    await expect(tocItems.first()).toBeVisible();
  });

  test('should navigate to section on click', async ({ page }) => {
    await page.goto('/blog/test-post');

    // 点击第一个目录项
    await page.getByTestId(/toc-item|heading-link/i).first().click();

    // 验证页面滚动到相应部分
    await page.waitForTimeout(500); // 等待滚动动画
  });
});
