#!/usr/bin/env python3
"""
API Testing Tool for CyberPress Platform

This script provides automated testing for all API endpoints.
Usage: python scripts/api_tester.py
"""

import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import sys

# Configuration
BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.refresh_token = None
        self.test_user_id = None
        self.test_post_id = None
        self.test_comment_id = None
        self.results = {
            'passed': 0,
            'failed': 0,
            'total': 0
        }

    def print_result(self, test_name: str, passed: bool, details: str = ""):
        """Print test result with color"""
        self.results['total'] += 1
        if passed:
            self.results['passed'] += 1
            print(f"{Colors.GREEN}✓ PASS{Colors.RESET} - {test_name}")
            if details:
                print(f"  {Colors.BLUE}{details}{Colors.RESET}")
        else:
            self.results['failed'] += 1
            print(f"{Colors.RED}✗ FAIL{Colors.RESET} - {test_name}")
            if details:
                print(f"  {Colors.RED}{details}{Colors.RESET}")

    def print_section(self, title: str):
        """Print section header"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 60}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{title.center(60)}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'=' * 60}{Colors.RESET}\n")

    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/health")
            self.print_result(
                "Health Check",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Health Check", False, str(e))
            return False

    def test_register(self):
        """Test user registration"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            user_data = {
                "email": f"test{timestamp}@cyberpress.dev",
                "username": f"testuser{timestamp}",
                "password": "TestPass123!",
                "full_name": "Test User"
            }

            response = self.session.post(
                f"{API_V1}/auth/register",
                json=user_data
            )

            if response.status_code == 200:
                data = response.json()
                self.test_user_id = data.get('id')
                self.print_result(
                    "User Registration",
                    True,
                    f"User ID: {self.test_user_id}"
                )
                return True
            else:
                self.print_result(
                    "User Registration",
                    False,
                    f"Status: {response.status_code}, Error: {response.text}"
                )
                return False
        except Exception as e:
            self.print_result("User Registration", False, str(e))
            return False

    def test_login(self):
        """Test user login"""
        try:
            login_data = {
                "email": "admin@cyberpress.dev",
                "password": "admin123"
            }

            response = self.session.post(
                f"{API_V1}/auth/login",
                json=login_data
            )

            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('access_token')
                self.refresh_token = data.get('refresh_token')
                self.session.headers.update({
                    'Authorization': f'Bearer {self.auth_token}'
                })
                self.print_result(
                    "User Login",
                    True,
                    f"Token received: {self.auth_token[:20]}..."
                )
                return True
            else:
                self.print_result(
                    "User Login",
                    False,
                    f"Status: {response.status_code}"
                )
                return False
        except Exception as e:
            self.print_result("User Login", False, str(e))
            return False

    def test_get_posts(self):
        """Test getting posts list"""
        try:
            response = self.session.get(f"{API_V1}/posts")
            success = response.status_code == 200

            if success:
                data = response.json()
                if data and len(data) > 0:
                    self.test_post_id = data[0].get('id')
                    self.print_result(
                        "Get Posts List",
                        True,
                        f"Found {len(data)} posts"
                    )
                else:
                    self.print_result("Get Posts List", True, "No posts found")
            else:
                self.print_result("Get Posts List", False, f"Status: {response.status_code}")

            return success
        except Exception as e:
            self.print_result("Get Posts List", False, str(e))
            return False

    def test_create_post(self):
        """Test creating a post"""
        if not self.auth_token:
            self.print_result("Create Post", False, "Not authenticated")
            return False

        try:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            post_data = {
                "title": f"Test Post {timestamp}",
                "content": "# Test Content\n\nThis is a test post created by automated testing.",
                "excerpt": "This is a test post",
                "status": "draft"
            }

            response = self.session.post(
                f"{API_V1}/posts",
                json=post_data
            )

            if response.status_code == 200:
                data = response.json()
                self.test_post_id = data.get('id')
                self.print_result(
                    "Create Post",
                    True,
                    f"Post ID: {self.test_post_id}"
                )
                return True
            else:
                self.print_result(
                    "Create Post",
                    False,
                    f"Status: {response.status_code}, Error: {response.text}"
                )
                return False
        except Exception as e:
            self.print_result("Create Post", False, str(e))
            return False

    def test_get_post_detail(self):
        """Test getting post detail"""
        if not self.test_post_id:
            self.print_result("Get Post Detail", False, "No post ID available")
            return False

        try:
            response = self.session.get(f"{API_V1}/posts/{self.test_post_id}")
            self.print_result(
                "Get Post Detail",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Get Post Detail", False, str(e))
            return False

    def test_update_post(self):
        """Test updating a post"""
        if not self.test_post_id:
            self.print_result("Update Post", False, "No post ID available")
            return False

        try:
            update_data = {
                "title": "Updated Test Post",
                "content": "# Updated Content\n\nThis post has been updated."
            }

            response = self.session.put(
                f"{API_V1}/posts/{self.test_post_id}",
                json=update_data
            )

            self.print_result(
                "Update Post",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Update Post", False, str(e))
            return False

    def test_create_comment(self):
        """Test creating a comment"""
        if not self.test_post_id:
            self.print_result("Create Comment", False, "No post ID available")
            return False

        try:
            comment_data = {
                "content": "This is a test comment from automated testing.",
                "post_id": self.test_post_id
            }

            response = self.session.post(
                f"{API_V1}/comments",
                json=comment_data
            )

            if response.status_code == 200:
                data = response.json()
                self.test_comment_id = data.get('id')
                self.print_result(
                    "Create Comment",
                    True,
                    f"Comment ID: {self.test_comment_id}"
                )
                return True
            else:
                self.print_result(
                    "Create Comment",
                    False,
                    f"Status: {response.status_code}"
                )
                return False
        except Exception as e:
            self.print_result("Create Comment", False, str(e))
            return False

    def test_get_categories(self):
        """Test getting categories"""
        try:
            response = self.session.get(f"{API_V1}/categories")
            self.print_result(
                "Get Categories",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Get Categories", False, str(e))
            return False

    def test_get_tags(self):
        """Test getting tags"""
        try:
            response = self.session.get(f"{API_V1}/tags")
            self.print_result(
                "Get Tags",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Get Tags", False, str(e))
            return False

    def test_search(self):
        """Test search functionality"""
        try:
            response = self.session.get(f"{API_V1}/search?q=test")
            self.print_result(
                "Search",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Search", False, str(e))
            return False

    def test_user_profile(self):
        """Test getting user profile"""
        if not self.auth_token:
            self.print_result("Get User Profile", False, "Not authenticated")
            return False

        try:
            response = self.session.get(f"{API_V1}/users/me")
            self.print_result(
                "Get User Profile",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result("Get User Profile", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print(f"\n{Colors.BOLD}{Colors.CYAN}CyberPress API Tester{Colors.RESET}")
        print(f"{Colors.YELLOW}Testing: {BASE_URL}{Colors.RESET}\n")

        # Public endpoints
        self.print_section("Testing Public Endpoints")
        self.test_health_check()
        self.test_get_posts()
        self.test_get_categories()
        self.test_get_tags()
        self.test_search()

        # Authentication
        self.print_section("Testing Authentication")
        self.test_register()
        self.test_login()

        # Authenticated endpoints
        self.print_section("Testing Authenticated Endpoints")
        self.test_create_post()
        self.test_get_post_detail()
        self.test_update_post()
        self.test_create_comment()
        self.test_user_profile()

        # Print summary
        self.print_section("Test Summary")
        print(f"{Colors.BOLD}Total Tests:{Colors.RESET} {self.results['total']}")
        print(f"{Colors.GREEN}{Colors.BOLD}Passed:{Colors.RESET} {self.results['passed']}")
        print(f"{Colors.RED}{Colors.BOLD}Failed:{Colors.RESET} {self.results['failed']}")

        success_rate = (self.results['passed'] / self.results['total'] * 100) if self.results['total'] > 0 else 0
        print(f"{Colors.CYAN}{Colors.BOLD}Success Rate:{Colors.RESET} {success_rate:.1f}%\n")

        return self.results['failed'] == 0

def main():
    """Main entry point"""
    tester = APITester()
    success = tester.run_all_tests()

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
