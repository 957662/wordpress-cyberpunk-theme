"""
邮件模板服务
处理邮件模板渲染和发送
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
from pathlib import Path
from jinja2 import Template, Environment, FileSystemLoader
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from .email_service import EmailService
from core.config import settings


class EmailTemplateService:
    """邮件模板服务"""

    def __init__(self):
        self.email_service = EmailService()
        self.template_dir = Path(__file__).parent.parent / "templates" / "emails"
        self.env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            autoescape=True
        )

        # 内联模板
        self.inline_templates = {
            "welcome": self._get_welcome_template(),
            "reset_password": self._get_reset_password_template(),
            "verify_email": self._get_verify_email_template(),
            "comment_notification": self._get_comment_notification_template(),
            "follow_notification": self._get_follow_notification_template(),
            "like_notification": self._get_like_notification_template(),
            "newsletter": self._get_newsletter_template(),
        }

    async def send_template_email(
        self,
        to: str,
        subject: str,
        template_name: str,
        context: Dict[str, Any],
        plain_text: Optional[str] = None
    ) -> bool:
        """
        发送模板邮件

        Args:
            to: 收件人邮箱
            subject: 邮件主题
            template_name: 模板名称
            context: 模板上下文
            plain_text: 纯文本内容（可选）
        """
        try:
            # 渲染HTML模板
            html_content = self.render_template(template_name, context)

            # 如果没有提供纯文本，生成简单的纯文本版本
            if not plain_text:
                plain_text = self._generate_plain_text(context)

            # 发送邮件
            return await self.email_service.send_email(
                to=to,
                subject=subject,
                html_content=html_content,
                plain_text=plain_text
            )
        except Exception as e:
            print(f"发送模板邮件失败: {e}")
            return False

    def render_template(self, template_name: str, context: Dict[str, Any]) -> str:
        """渲染模板"""
        try:
            # 先尝试从文件加载
            try:
                template = self.env.get_template(f"{template_name}.html")
                return template.render(**context)
            except Exception:
                # 使用内联模板
                if template_name in self.inline_templates:
                    template = Template(self.inline_templates[template_name])
                    return template.render(**context)
                raise Exception(f"模板 {template_name} 不存在")
        except Exception as e:
            print(f"渲染模板失败: {e}")
            return ""

    def _generate_plain_text(self, context: Dict[str, Any]) -> str:
        """生成纯文本版本"""
        return f"""
        这是一个来自 {settings.SITE_NAME} 的邮件。

        {context.get('message', '')}

        ---
        {settings.SITE_NAME}
        {settings.SITE_URL}
        """

    def _get_welcome_template(self) -> str:
        """欢迎邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>欢迎来到 {{ site_name }}!</h1>
                </div>
                <div class="content">
                    <p>你好，{{ username }}!</p>
                    <p>感谢你注册 {{ site_name }}。我们很高兴你加入我们的社区！</p>
                    <p>在这里，你可以：</p>
                    <ul>
                        <li>发布和分享你的博客文章</li>
                        <li>关注感兴趣的作者</li>
                        <li>参与评论和讨论</li>
                        <li>探索更多精彩内容</li>
                    </ul>
                    <a href="{{ site_url }}" class="button">开始探索</a>
                    <p>如果你有任何问题，随时联系我们。</p>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                    <p>你收到此邮件是因为你在 {{ site_name }} 注册了账户。</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_reset_password_template(self) -> str:
        """重置密码邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>重置你的密码</h1>
                </div>
                <div class="content">
                    <p>你好，{{ username }}!</p>
                    <p>我们收到了重置你账户密码的请求。</p>
                    <p>点击下面的按钮重置密码：</p>
                    <a href="{{ reset_url }}" class="button">重置密码</a>
                    <p class="warning">
                        <strong>此链接将在 {{ expire_hours }} 小时后过期。</strong><br>
                        如果你没有请求重置密码，请忽略此邮件。
                    </p>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_verify_email_template(self) -> str:
        """邮箱验证邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>验证你的邮箱</h1>
                </div>
                <div class="content">
                    <p>你好，{{ username }}!</p>
                    <p>感谢你注册 {{ site_name }}。请点击下面的按钮验证你的邮箱地址：</p>
                    <a href="{{ verify_url }}" class="button">验证邮箱</a>
                    <p>或者复制以下链接到浏览器：</p>
                    <p style="background: #eee; padding: 10px; word-break: break-all;">{{ verify_url }}</p>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_comment_notification_template(self) -> str:
        """评论通知邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .comment-box { background: white; padding: 15px; border-left: 4px solid #00f0ff; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>新评论通知</h1>
                </div>
                <div class="content">
                    <p>你好，{{ username }}!</p>
                    <p><strong>{{ commenter_name }}</strong> 在你的文章《{{ post_title }}》中发表了评论：</p>
                    <div class="comment-box">
                        <p>{{ comment_content }}</p>
                    </div>
                    <a href="{{ comment_url }}" class="button">查看评论</a>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_follow_notification_template(self) -> str:
        """关注通知邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>新的关注者</h1>
                </div>
                <div class="content">
                    <p>你好，{{ username }}!</p>
                    <p><strong>{{ follower_name }}</strong> 开始关注你了！</p>
                    {% if follower_bio %}
                    <p><strong>个人简介：</strong>{{ follower_bio }}</p>
                    {% endif %}
                    <a href="{{ follower_profile_url }}" class="button">查看个人资料</a>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_like_notification_template(self) -> str:
        """点赞通知邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>你的文章被点赞了！</h1>
                </div>
                <div class="content">
                    <p>你好，{{ username }}!</p>
                    <p><strong>{{ liker_name }}</strong> 赞了你的文章《{{ post_title }}》</p>
                    <a href="{{ post_url }}" class="button">查看文章</a>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_newsletter_template(self) -> str:
        """新闻订阅邮件模板"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff, #9d00ff); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .post { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                .post-title { color: #00f0ff; margin-bottom: 10px; }
                .post-excerpt { color: #666; }
                .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .unsubscribe { font-size: 11px; color: #999; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{{ newsletter_title }}</h1>
                    <p>{{ date }}</p>
                </div>
                <div class="content">
                    <p>{{ intro_text }}</p>

                    {% for post in featured_posts %}
                    <div class="post">
                        <h3 class="post-title">{{ post.title }}</h3>
                        <p class="post-excerpt">{{ post.excerpt }}</p>
                        <a href="{{ post.url }}" class="button">阅读更多</a>
                    </div>
                    {% endfor %}

                    <p>{{ outro_text }}</p>
                </div>
                <div class="footer">
                    <p>© {{ year }} {{ site_name }}. All rights reserved.</p>
                    <p class="unsubscribe">
                        <a href="{{ unsubscribe_url }}">取消订阅</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

    async def send_welcome_email(self, to: str, username: str) -> bool:
        """发送欢迎邮件"""
        context = {
            "username": username,
            "site_name": settings.SITE_NAME,
            "site_url": settings.SITE_URL,
            "year": datetime.now().year
        }
        return await self.send_template_email(
            to=to,
            subject=f"欢迎来到 {settings.SITE_NAME}!",
            template_name="welcome",
            context=context
        )

    async def send_password_reset_email(
        self,
        to: str,
        username: str,
        reset_url: str,
        expire_hours: int = 24
    ) -> bool:
        """发送密码重置邮件"""
        context = {
            "username": username,
            "reset_url": reset_url,
            "expire_hours": expire_hours,
            "site_name": settings.SITE_NAME,
            "year": datetime.now().year
        }
        return await self.send_template_email(
            to=to,
            subject="重置你的密码",
            template_name="reset_password",
            context=context
        )

    async def send_email_verification_email(
        self,
        to: str,
        username: str,
        verify_url: str
    ) -> bool:
        """发送邮箱验证邮件"""
        context = {
            "username": username,
            "verify_url": verify_url,
            "site_name": settings.SITE_NAME,
            "year": datetime.now().year
        }
        return await self.send_template_email(
            to=to,
            subject="验证你的邮箱",
            template_name="verify_email",
            context=context
        )

    async def send_comment_notification_email(
        self,
        to: str,
        username: str,
        commenter_name: str,
        post_title: str,
        comment_content: str,
        comment_url: str
    ) -> bool:
        """发送评论通知邮件"""
        context = {
            "username": username,
            "commenter_name": commenter_name,
            "post_title": post_title,
            "comment_content": comment_content,
            "comment_url": comment_url,
            "site_name": settings.SITE_NAME,
            "year": datetime.now().year
        }
        return await self.send_template_email(
            to=to,
            subject=f"新评论：{commenter_name} 评论了你的文章",
            template_name="comment_notification",
            context=context
        )

    async def send_follow_notification_email(
        self,
        to: str,
        username: str,
        follower_name: str,
        follower_bio: Optional[str],
        follower_profile_url: str
    ) -> bool:
        """发送关注通知邮件"""
        context = {
            "username": username,
            "follower_name": follower_name,
            "follower_bio": follower_bio,
            "follower_profile_url": follower_profile_url,
            "site_name": settings.SITE_NAME,
            "year": datetime.now().year
        }
        return await self.send_template_email(
            to=to,
            subject=f"{follower_name} 开始关注你了",
            template_name="follow_notification",
            context=context
        )

    async def send_newsletter(
        self,
        to_list: List[str],
        subject: str,
        newsletter_title: str,
        intro_text: str,
        outro_text: str,
        featured_posts: List[Dict[str, str]],
        unsubscribe_url: str
    ) -> int:
        """发送新闻订阅邮件"""
        context = {
            "newsletter_title": newsletter_title,
            "date": datetime.now().strftime("%Y年%m月%d日"),
            "intro_text": intro_text,
            "outro_text": outro_text,
            "featured_posts": featured_posts,
            "unsubscribe_url": unsubscribe_url,
            "site_name": settings.SITE_NAME,
            "site_url": settings.SITE_URL,
            "year": datetime.now().year
        }

        success_count = 0
        for to in to_list:
            if await self.send_template_email(
                to=to,
                subject=subject,
                template_name="newsletter",
                context=context
            ):
                success_count += 1

        return success_count


# 创建全局实例
email_template_service = EmailTemplateService()
