#!/usr/bin/env python3
"""
CyberPress Platform - API 测试脚本
用于测试所有 API 端点
"""

import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime

# API 基础 URL
BASE_URL = "http://localhost:8000/api/v1"

# 颜色输出
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'

def print_success(msg: str):
    print(f"{Colors.GREEN}✓ {msg}{Colors.ENDC}")

def print_error(msg: str):
    print(f"{Colors.RED}✗ {msg}{Colors.ENDC}")

def print_info(msg: str):
    print(f"{Colors.BLUE}ℹ {msg}{Colors.ENDC}")

def print_warning(msg: str):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.ENDC}")

class APITester:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.token: Optional[str] = None
        self.test_results = []

    def request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """发送 HTTP 请求"""
        url = f"{self.base_url}{endpoint}"
        headers = kwargs.pop('headers', {})

        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            response = self.session.request(method, url, headers=headers, **kwargs)
            return {
                'status_code': response.status_code,
                'data': response.json() if response.content else {},
                'success': response.status_code < 400
            }
        except Exception as e:
            return {
                'status_code': 0,
                'data': {'error': str(e)},
                'success': False
            }

    def test_health_check(self):
        """测试健康检查端点"""
        print_info("\n【1】测试健康检查端点...")
        result = self.request('GET', '/health')

        if result['success'] and result['data'].get('status') == 'ok':
            print_success("健康检查通过")
            self.test_results.append(('Health Check', True))
        else:
            print_error(f"健康检查失败: {result['data']}")
            self.test_results.append(('Health Check', False))

    def test_register(self):
        """测试用户注册"""
        print_info("\n【2】测试用户注册...")

        # 生成随机用户名
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        username = f"testuser_{timestamp}"
        email = f"test_{timestamp}@example.com"

        payload = {
            "username": username,
            "email": email,
            "password": "test123456",
            "full_name": "Test User"
        }

        result = self.request('POST', '/auth/register', json=payload)

        if result['success']:
            print_success(f"用户注册成功: {username}")
            self.test_results.append(('Register', True))
            return username, payload['password']
        else:
            print_warning(f"用户注册失败或已存在: {result['data']}")
            self.test_results.append(('Register', False))
            return 'admin', 'admin123'  # 使用默认管理员账号

    def test_login(self, username: str, password: str):
        """测试用户登录"""
        print_info("\n【3】测试用户登录...")

        payload = {
            "username": username,
            "password": password
        }

        result = self.request('POST', '/auth/login', data=payload)

        if result['success']:
            self.token = result['data'].get('access_token')
            print_success("用户登录成功")
            self.test_results.append(('Login', True))
        else:
            print_error(f"用户登录失败: {result['data']}")
            self.test_results.append(('Login', False))

    def test_get_posts(self):
        """测试获取文章列表"""
        print_info("\n【4】测试获取文章列表...")
        result = self.request('GET', '/posts')

        if result['success']:
            posts = result['data'].get('items', [])
            print_success(f"获取文章列表成功，共 {len(posts)} 篇")
            self.test_results.append(('Get Posts', True))
            return posts
        else:
            print_error(f"获取文章列表失败: {result['data']}")
            self.test_results.append(('Get Posts', False))
            return []

    def test_create_post(self):
        """测试创建文章"""
        print_info("\n【5】测试创建文章...")

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        payload = {
            "title": f"Test Post {timestamp}",
            "content": "This is a test post created by API tester.",
            "excerpt": "Test post excerpt",
            "status": "draft"
        }

        result = self.request('POST', '/posts', json=payload)

        if result['success']:
            post_id = result['data'].get('id')
            print_success(f"创建文章成功，ID: {post_id}")
            self.test_results.append(('Create Post', True))
            return post_id
        else:
            print_error(f"创建文章失败: {result['data']}")
            self.test_results.append(('Create Post', False))
            return None

    def test_get_categories(self):
        """测试获取分类"""
        print_info("\n【6】测试获取分类...")
        result = self.request('GET', '/categories')

        if result['success']:
            categories = result['data'].get('items', [])
            print_success(f"获取分类成功，共 {len(categories)} 个")
            self.test_results.append(('Get Categories', True))
        else:
            print_error(f"获取分类失败: {result['data']}")
            self.test_results.append(('Get Categories', False))

    def test_get_tags(self):
        """测试获取标签"""
        print_info("\n【7】测试获取标签...")
        result = self.request('GET', '/tags')

        if result['success']:
            tags = result['data'].get('items', [])
            print_success(f"获取标签成功，共 {len(tags)} 个")
            self.test_results.append(('Get Tags', True))
        else:
            print_error(f"获取标签失败: {result['data']}")
            self.test_results.append(('Get Tags', False))

    def test_search(self):
        """测试搜索功能"""
        print_info("\n【8】测试搜索功能...")
        result = self.request('GET', '/search?q=test')

        if result['success']:
            print_success("搜索功能正常")
            self.test_results.append(('Search', True))
        else:
            print_error(f"搜索功能失败: {result['data']}")
            self.test_results.append(('Search', False))

    def print_summary(self):
        """打印测试摘要"""
        print("\n" + "="*50)
        print_info("测试摘要")
        print("="*50)

        total = len(self.test_results)
        passed = sum(1 for _, result in self.test_results if result)
        failed = total - passed

        for test_name, result in self.test_results:
            status = f"{Colors.GREEN}✓ 通过{Colors.ENDC}" if result else f"{Colors.RED}✗ 失败{Colors.ENDC}"
            print(f"  {test_name}: {status}")

        print("\n" + "-"*50)
        print(f"总计: {total} | 通过: {passed} | 失败: {failed}")
        print(f"成功率: {passed/total*100:.1f}%")
        print("="*50)

    def run_all_tests(self):
        """运行所有测试"""
        print(f"\n{Colors.BLUE}{'='*50}")
        print(f"{Colors.BLUE}CyberPress API 测试开始")
        print(f"{Colors.BLUE}{'='*50}{Colors.ENDC}")
        print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"API 地址: {self.base_url}")

        # 测试序列
        self.test_health_check()

        # 认证测试
        username, password = self.test_register()
        self.test_login(username, password)

        # 内容测试
        if self.token:  # 只有登录后才测试需要认证的接口
            posts = self.test_get_posts()
            self.test_create_post()

        # 公开接口测试
        self.test_get_categories()
        self.test_get_tags()
        self.test_search()

        # 打印摘要
        self.print_summary()

def main():
    """主函数"""
    import sys

    # 检查命令行参数
    base_url = sys.argv[1] if len(sys.argv) > 1 else BASE_URL

    tester = APITester(base_url)
    tester.run_all_tests()

if __name__ == "__main__":
    main()
