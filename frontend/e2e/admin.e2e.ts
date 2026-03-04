/**
 * 管理后台 E2E 测试
 */

import { test, expect } from '@playwright/test';

test.describe('管理后台 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 登录管理员账号
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@cyberpress.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // 等待登录成功并跳转到仪表盘
    await page.waitForURL('http://localhost:3000/admin/dashboard');
  });

  test('应该显示仪表盘统计', async ({ page }) => {
    // 验证仪表盘标题
    await expect(page.locator('h1')).toContainText('仪表盘');

    // 验证统计卡片显示
    const statsCards = page.locator('.stat-card');
    await expect(statsCards).toHaveCount(4); // 总文章数、总用户数、总评论数、总访问量

    // 验证每个卡片的内容
    await expect(page.locator('text=总文章数')).toBeVisible();
    await expect(page.locator('text=总用户数')).toBeVisible();
    await expect(page.locator('text=总评论数')).toBeVisible();
    await expect(page.locator('text=总访问量')).toBeVisible();
  });

  test('应该创建新文章', async ({ page }) => {
    // 导航到文章管理页
    await page.goto('http://localhost:3000/admin/posts');

    // 点击新建文章按钮
    await page.click('button:has-text("新建文章")');

    // 验证编辑器页面加载
    await expect(page.locator('input[name="title"]')).toBeVisible();

    // 填写文章信息
    await page.fill('input[name="title"]', '测试文章标题');
    await page.fill('textarea[name="content"]', '# 这是测试内容\n\n这是一篇测试文章。');

    // 选择分类
    await page.click('button:has-text("选择分类")');
    await page.click('.category-option:first-child');

    // 添加标签
    await page.fill('input[placeholder*="标签"]', 'React');
    await page.press('input[placeholder*="标签"]', 'Enter');

    // 保存文章
    await page.click('button:has-text("保存草稿")');

    // 验证保存成功
    await expect(page.locator('text=文章已保存')).toBeVisible();

    // 发布文章
    await page.click('button:has-text("发布")');

    // 验证发布成功
    await expect(page.locator('text=文章已发布')).toBeVisible();
  });

  test('应该编辑现有文章', async ({ page }) => {
    // 导航到文章管理页
    await page.goto('http://localhost:3000/admin/posts');

    // 点击第一篇文章的编辑按钮
    await page.click('.post-list-item:first-child button:has-text("编辑")');

    // 验证编辑器页面加载
    await expect(page.locator('input[name="title"]')).toBeVisible();

    // 修改标题
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('修改后的文章标题');

    // 保存修改
    await page.click('button:has-text("保存修改")');

    // 验证保存成功
    await expect(page.locator('text=修改已保存')).toBeVisible();
  });

  test('应该删除文章', async ({ page }) => {
    // 导航到文章管理页
    await page.goto('http://localhost:3000/admin/posts');

    // 记录删除前的文章数量
    const beforeCount = await page.locator('.post-list-item').count();

    // 点击第一篇文章的删除按钮
    await page.click('.post-list-item:first-child button:has-text("删除")');

    // 确认删除
    await page.click('.confirm-delete-modal button:has-text("确认")');

    // 验证删除成功提示
    await expect(page.locator('text=文章已删除')).toBeVisible();

    // 验证文章数量减少
    const afterCount = await page.locator('.post-list-item').count();
    expect(afterCount).toBe(beforeCount - 1);
  });

  test('应该管理媒体库', async ({ page }) => {
    // 导航到媒体库页
    await page.goto('http://localhost:3000/admin/media');

    // 验证媒体库页面加载
    await expect(page.locator('h1')).toContainText('媒体库');

    // 点击上传按钮
    await page.click('button:has-text("上传文件")');

    // 选择文件
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/test-image.jpg');

    // 等待上传完成
    await expect(page.locator('text=上传成功')).toBeVisible({ timeout: 10000 });

    // 验证图片出现在媒体库中
    await expect(page.locator('.media-item img')).toBeVisible();
  });

  test('应该管理评论', async ({ page }) => {
    // 导航到评论管理页
    await page.goto('http://localhost:3000/admin/comments');

    // 验证评论管理页面加载
    await expect(page.locator('h1')).toContainText('评论管理');

    // 审核通过评论
    await page.click('.comment-item:first-child button:has-text("通过")');

    // 验证操作成功
    await expect(page.locator('text=评论已审核通过')).toBeVisible();

    // 拒绝评论
    await page.click('.comment-item:first-child button:has-text("拒绝")');

    // 验证操作成功
    await expect(page.locator('text=评论已拒绝')).toBeVisible();
  });

  test('应该管理用户', async ({ page }) => {
    // 导航到用户管理页
    await page.goto('http://localhost:3000/admin/users');

    // 验证用户管理页面加载
    await expect(page.locator('h1')).toContainText('用户管理');

    // 搜索用户
    await page.fill('input[placeholder*="搜索用户"]', 'testuser');
    await page.press('input[placeholder*="搜索用户"]', 'Enter');

    // 等待搜索结果
    await page.waitForSelector('.user-item');

    // 点击查看用户详情
    await page.click('.user-item:first-child');

    // 验证用户详情显示
    await expect(page.locator('.user-detail')).toBeVisible();
  });

  test('应该管理分类', async ({ page }) => {
    // 导航到分类管理页
    await page.goto('http://localhost:3000/admin/categories');

    // 验证分类管理页面加载
    await expect(page.locator('h1')).toContainText('分类管理');

    // 点击新建分类按钮
    await page.click('button:has-text("新建分类")');

    // 填写分类信息
    await page.fill('input[name="name"]', '测试分类');
    await page.fill('input[name="slug"]', 'test-category');
    await page.fill('textarea[name="description"]', '这是一个测试分类');

    // 保存分类
    await page.click('button:has-text("保存")');

    // 验证保存成功
    await expect(page.locator('text=分类已创建')).toBeVisible();
  });

  test('应该管理标签', async ({ page }) => {
    // 导航到标签管理页
    await page.goto('http://localhost:3000/admin/tags');

    // 验证标签管理页面加载
    await expect(page.locator('h1')).toContainText('标签管理');

    // 点击新建标签按钮
    await page.click('button:has-text("新建标签")');

    // 填写标签信息
    await page.fill('input[name="name"]', '测试标签');
    await page.fill('input[name="slug"]', 'test-tag');

    // 保存标签
    await page.click('button:has-text("保存")');

    // 验证保存成功
    await expect(page.locator('text=标签已创建')).toBeVisible();
  });

  test('应该配置系统设置', async ({ page }) => {
    // 导航到系统设置页
    await page.goto('http://localhost:3000/admin/settings');

    // 验证系统设置页面加载
    await expect(page.locator('h1')).toContainText('系统设置');

    // 修改站点名称
    const siteNameInput = page.locator('input[name="siteName"]');
    await siteNameInput.clear();
    await siteNameInput.fill('CyberPress 测试站点');

    // 修改站点描述
    await page.fill('textarea[name="siteDescription"]', '这是测试站点的描述');

    // 保存设置
    await page.click('button:has-text("保存设置")');

    // 验证保存成功
    await expect(page.locator('text=设置已保存')).toBeVisible();
  });

  test('应该查看数据分析', async ({ page }) => {
    // 导航到数据分析页
    await page.goto('http://localhost:3000/admin/analytics');

    // 验证数据分析页面加载
    await expect(page.locator('h1')).toContainText('数据分析');

    // 验证图表显示
    await expect(page.locator('.chart-container')).toBeVisible();

    // 验证数据统计
    await expect(page.locator('text=访问量')).toBeVisible();
    await expect(page.locator('text=页面浏览量')).toBeVisible();
    await expect(page.locator('text=独立访客')).toBeVisible();
  });

  test('应该导出数据', async ({ page }) => {
    // 导航到数据导出页
    await page.goto('http://localhost:3000/admin/export');

    // 选择导出类型
    await page.click('input[value="posts"]');

    // 选择导出格式
    await page.click('select[name="format"]');
    await page.click('option[value="csv"]');

    // 点击导出按钮
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("导出数据")');
    const download = await downloadPromise;

    // 验证文件下载
    expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx)$/);
  });
});

test.describe('管理后台性能测试', () => {
  test('应该快速加载仪表盘', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@cyberpress.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // 测量加载时间
    const startTime = Date.now();
    await page.waitForURL('http://localhost:3000/admin/dashboard');
    const loadTime = Date.now() - startTime;

    // 验证加载时间在合理范围内（小于3秒）
    expect(loadTime).toBeLessThan(3000);
  });

  test('应该快速加载文章列表', async ({ page }) => {
    // 登录
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@cyberpress.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/admin/dashboard');

    // 导航到文章管理
    await page.goto('http://localhost:3000/admin/posts');

    // 测量加载时间
    const startTime = Date.now();
    await page.waitForSelector('.post-list-item');
    const loadTime = Date.now() - startTime;

    // 验证加载时间在合理范围内（小于2秒）
    expect(loadTime).toBeLessThan(2000);
  });
});
