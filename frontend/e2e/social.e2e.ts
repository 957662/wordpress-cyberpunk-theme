/**
 * 社交功能 E2E 测试
 */

import { test, expect, type Page } from '@playwright/test';

test.describe('社交功能 E2E 测试', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('应该完成用户关注流程', async () => {
    // 导航到用户资料页
    await page.goto('http://localhost:3000/profile/testuser');

    // 点击关注按钮
    const followButton = page.locator('button:has-text("关注")');
    await expect(followButton).toBeVisible();
    await followButton.click();

    // 验证关注成功
    await expect(page.locator('button:has-text("已关注")')).toBeVisible();

    // 取消关注
    await page.locator('button:has-text("已关注")').click();

    // 验证取消关注成功
    await expect(page.locator('button:has-text("关注")')).toBeVisible();
  });

  test('应该完成文章点赞流程', async () => {
    // 导航到文章详情页
    await page.goto('http://localhost:3000/blog/test-post');

    // 点击点赞按钮
    const likeButton = page.locator('button[aria-label="点赞"]');
    await expect(likeButton).toBeVisible();
    await likeButton.click();

    // 验证点赞成功
    await expect(page.locator('button[aria-label="取消点赞"]')).toBeVisible();

    // 检查点赞数增加
    const likeCount = page.locator('[data-testid="like-count"]');
    await expect(likeCount).toContainText(/\d+/);

    // 取消点赞
    await page.locator('button[aria-label="取消点赞"]').click();

    // 验证取消点赞成功
    await expect(page.locator('button[aria-label="点赞"]')).toBeVisible();
  });

  test('应该完成文章收藏流程', async () => {
    // 导航到文章详情页
    await page.goto('http://localhost:3000/blog/test-post');

    // 点击收藏按钮
    const bookmarkButton = page.locator('button[aria-label="收藏"]');
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();

    // 验证收藏成功
    await expect(page.locator('button[aria-label="取消收藏"]')).toBeVisible();

    // 检查收藏列表
    await page.goto('http://localhost:3000/user-dashboard?tab=saved');
    await expect(page.locator('text=收藏的文章')).toBeVisible();

    // 返回文章页并取消收藏
    await page.goto('http://localhost:3000/blog/test-post');
    await page.locator('button[aria-label="取消收藏"]').click();

    // 验证取消收藏成功
    await expect(page.locator('button[aria-label="收藏"]')).toBeVisible();
  });

  test('应该完成评论流程', async () => {
    // 导航到文章详情页
    await page.goto('http://localhost:3000/blog/test-post');

    // 滚动到评论区域
    await page.locator('#comments').scrollIntoViewIfNeeded();

    // 输入评论
    const commentInput = page.locator('textarea[placeholder*="评论"]');
    await expect(commentInput).toBeVisible();
    await commentInput.fill('这是一条测试评论');

    // 提交评论
    const submitButton = page.locator('button:has-text("发表评论")');
    await submitButton.click();

    // 验证评论成功
    await expect(page.locator('text=评论发表成功')).toBeVisible();

    // 验证评论显示在列表中
    await expect(page.locator('text=这是一条测试评论')).toBeVisible();
  });

  test('应该完成回复评论流程', async () => {
    // 导航到文章详情页
    await page.goto('http://localhost:3000/blog/test-post');

    // 点击回复按钮
    const replyButton = page.locator('.comment:first-child button:has-text("回复")');
    await replyButton.click();

    // 输入回复内容
    const replyInput = page.locator('.comment-reply textarea');
    await replyInput.fill('这是一条测试回复');

    // 提交回复
    const submitReplyButton = page.locator('.comment-reply button:has-text("发送")');
    await submitReplyButton.click();

    // 验证回复成功
    await expect(page.locator('text=回复发表成功')).toBeVisible();
  });

  test('应该查看通知列表', async () => {
    // 点击通知图标
    const notificationIcon = page.locator('button[aria-label="通知"]');
    await notificationIcon.click();

    // 验证通知面板打开
    const notificationPanel = page.locator('[role="dialog"]');
    await expect(notificationPanel).toBeVisible();

    // 检查通知列表
    const notifications = notificationPanel.locator('.notification-item');
    const count = await notifications.count();
    expect(count).toBeGreaterThan(0);

    // 点击一个通知
    await notifications.first().click();

    // 验证导航到相关页面
    await expect(page).toHaveURL(/\/blog\/|\/profile\//);
  });

  test('应该查看个人资料的关注者', async () => {
    // 导航到个人资料页
    await page.goto('http://localhost:3000/profile/testuser');

    // 点击关注者标签
    const followersTab = page.locator('button:has-text("关注者")');
    await followersTab.click();

    // 验证关注者列表显示
    const followersList = page.locator('.followers-list');
    await expect(followersList).toBeVisible();

    // 检查关注者数量
    const followers = followersList.locator('.user-card');
    const count = await followers.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('应该查看个人资料的关注中', async () => {
    // 导航到个人资料页
    await page.goto('http://localhost:3000/profile/testuser');

    // 点击关注中标签
    const followingTab = page.locator('button:has-text("关注中")');
    await followingTab.click();

    // 验证关注中列表显示
    const followingList = page.locator('.following-list');
    await expect(followingList).toBeVisible();

    // 检查关注中数量
    const following = followingList.locator('.user-card');
    const count = await following.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('应该完成用户搜索流程', async () => {
    // 点击搜索按钮
    const searchButton = page.locator('button[aria-label="搜索"]');
    await searchButton.click();

    // 输入搜索关键词
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('testuser');
    await page.waitForTimeout(300); // 等待防抖

    // 验证搜索结果显示
    const searchResults = page.locator('.search-results');
    await expect(searchResults).toBeVisible();

    // 点击用户搜索结果
    await page.locator('.search-result-user:first-child').click();

    // 验证导航到用户资料页
    await expect(page).toHaveURL(/\/profile\//);
  });

  test('应该完成社交统计显示', async () => {
    // 导航到文章详情页
    await page.goto('http://localhost:3000/blog/test-post');

    // 验证社交统计显示
    const likeCount = page.locator('[data-testid="like-count"]');
    const commentCount = page.locator('[data-testid="comment-count"]');
    const shareCount = page.locator('[data-testid="share-count"]');

    await expect(likeCount).toBeVisible();
    await expect(commentCount).toBeVisible();
    await expect(shareCount).toBeVisible();

    // 验证统计数据格式
    await expect(likeCount).toContainText(/\d+/);
    await expect(commentCount).toContainText(/\d+/);
  });

  test('应该完成分享功能流程', async () => {
    // 导航到文章详情页
    await page.goto('http://localhost:3000/blog/test-post');

    // 点击分享按钮
    const shareButton = page.locator('button[aria-label="分享"]');
    await shareButton.click();

    // 验证分享面板打开
    const sharePanel = page.locator('.share-panel');
    await expect(sharePanel).toBeVisible();

    // 点击复制链接
    const copyLinkButton = page.locator('button:has-text("复制链接")');
    await copyLinkButton.click();

    // 验证复制成功提示
    await expect(page.locator('text=链接已复制')).toBeVisible();
  });
});

test.describe('社交性能测试', () => {
  test('应该快速加载大量关注者列表', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/testuser/followers');

    // 测量加载时间
    const startTime = Date.now();
    await page.waitForSelector('.user-card');
    const loadTime = Date.now() - startTime;

    // 验证加载时间在合理范围内（小于3秒）
    expect(loadTime).toBeLessThan(3000);
  });

  test('应该快速加载通知列表', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 点击通知图标
    await page.click('button[aria-label="通知"]');

    // 测量加载时间
    const startTime = Date.now();
    await page.waitForSelector('.notification-item');
    const loadTime = Date.now() - startTime;

    // 验证加载时间在合理范围内（小于2秒）
    expect(loadTime).toBeLessThan(2000);
  });
});
