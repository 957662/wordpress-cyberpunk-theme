/**
 * Authentication E2E Tests
 *
 * 测试用户认证流程：注册、登录、登出
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('/');
  });

  test('should display login button', async ({ page }) => {
    // 检查登录按钮是否存在
    const loginButton = page.getByRole('link', { name: /login|登录/i });
    await expect(loginButton).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // 点击登录按钮
    await page.getByRole('link', { name: /login|登录/i }).click();

    // 验证 URL
    await expect(page).toHaveURL(/\/auth\/login/);

    // 验证页面标题
    await expect(page.getByRole('heading', { name: /login|登录/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login');

    // 尝试提交空表单
    await page.getByRole('button', { name: /login|登录/i }).click();

    // 验证错误提示
    await expect(page.getByText(/username.*required/i)).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // 填写登录表单
    await page.getByLabel(/username|用户名/i).fill('testuser');
    await page.getByLabel(/password|密码/i).fill('password123');

    // 提交表单
    await page.getByRole('button', { name: /login|登录/i }).click();

    // 验证登录成功 - 应该重定向到首页或仪表盘
    await expect(page).toHaveURL(/\/(dashboard|profile)?/);

    // 验证用户菜单显示
    await expect(page.getByText(/testuser/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // 填写错误的登录信息
    await page.getByLabel(/username|用户名/i).fill('wronguser');
    await page.getByLabel(/password|密码/i).fill('wrongpassword');

    // 提交表单
    await page.getByRole('button', { name: /login|登录/i }).click();

    // 验证错误提示
    await expect(page.getByText(/invalid.*credentials|登录失败/i)).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/auth/login');

    // 点击注册链接
    await page.getByRole('link', { name: /register|注册/i }).click();

    // 验证 URL
    await expect(page).toHaveURL(/\/auth\/register/);

    // 验证页面标题
    await expect(page.getByRole('heading', { name: /register|注册/i })).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/auth/register');

    // 生成随机用户名
    const randomUsername = `user_${Date.now()()}`;

    // 填写注册表单
    await page.getByLabel(/username|用户名/i).fill(randomUsername);
    await page.getByLabel(/email|邮箱/i).fill(`${randomUsername}@example.com`);
    await page.getByLabel(/password|密码/i).fill('password123');
    await page.getByLabel(/confirm.*password|确认密码/i).fill('password123');

    // 提交表单
    await page.getByRole('button', { name: /register|注册/i }).click();

    // 验证注册成功
    await expect(page.getByText(/registration.*successful|注册成功/i)).toBeVisible();
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/auth/register');

    // 填写表单，密码不匹配
    await page.getByLabel(/username|用户名/i).fill('testuser');
    await page.getByLabel(/email|邮箱/i).fill('test@example.com');
    await page.getByLabel(/password|密码/i).fill('password123');
    await page.getByLabel(/confirm.*password|确认密码/i).fill('different123');

    // 提交表单
    await page.getByRole('button', { name: /register|注册/i }).click();

    // 验证错误提示
    await expect(page.getByText(/passwords.*do not match|密码不匹配/i)).toBeVisible();
  });

  test('should logout user', async ({ page }) => {
    // 先登录
    await page.goto('/auth/login');
    await page.getByLabel(/username|用户名/i).fill('testuser');
    await page.getByLabel(/password|密码/i).fill('password123');
    await page.getByRole('button', { name: /login|登录/i }).click();

    // 等待登录成功
    await expect(page.getByText(/testuser/i)).toBeVisible();

    // 打开用户菜单
    await page.getByRole('button', { name: /testuser/i }).click();

    // 点击登出
    await page.getByRole('menuitem', { name: /logout|登出/i }).click();

    // 验证登出成功
    await expect(page.getByRole('link', { name: /login|登录/i })).toBeVisible();
  });
});

test.describe('Password Reset', () => {
  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/login');

    // 点击"忘记密码"链接
    await page.getByRole('link', { name: /forgot.*password|忘记密码/i }).click();

    // 验证 URL
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  test('should send password reset email', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    // 输入邮箱
    await page.getByLabel(/email|邮箱/i).fill('test@example.com');

    // 提交表单
    await page.getByRole('button', { name: /send.*email|发送邮件/i }).click();

    // 验证成功消息
    await expect(page.getByText(/email.*sent|邮件已发送/i)).toBeVisible();
  });
});
