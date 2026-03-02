"""Email Service for CyberPress Platform

This module handles email sending functionality using SMTP.
Supports both HTML and plain text emails.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from typing import Optional, List
from jinja2 import Template
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SMTP"""

    def __init__(self):
        """Initialize email service with settings"""
        self.smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_user = os.getenv('SMTP_USER', '')
        self.smtp_password = os.getenv('SMTP_PASSWORD', '')
        self.smtp_from = os.getenv('SMTP_FROM', 'noreply@cyberpress.dev')
        self.smtp_from_name = os.getenv('SMTP_FROM_NAME', 'CyberPress')
        self.use_tls = os.getenv('SMTP_USE_TLS', 'true').lower() == 'true'

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        from_email: Optional[str] = None,
        from_name: Optional[str] = None,
    ) -> bool:
        """Send an email

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML content of the email
            text_content: Plain text content (fallback)
            from_email: Sender email (default: from settings)
            from_name: Sender name (default: from settings)

        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            # Create message
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = formataddr((
                from_name or self.smtp_from_name,
                from_email or self.smtp_from
            ))
            message['To'] = to_email

            # Add plain text version
            if text_content:
                text_part = MIMEText(text_content, 'plain', 'utf-8')
                message.attach(text_part)

            # Add HTML version
            html_part = MIMEText(html_content, 'html', 'utf-8')
            message.attach(html_part)

            # Connect to SMTP server and send
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()

                if self.smtp_user and self.smtp_password:
                    server.login(self.smtp_user, self.smtp_password)

                server.send_message(message)

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_welcome_email(
        self,
        to_email: str,
        username: str,
    ) -> bool:
        """Send welcome email to new user

        Args:
            to_email: User's email address
            username: Username

        Returns:
            True if email sent successfully
        """
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
                         padding: 20px; text-align: center; color: white; }
                .content { padding: 20px; background: #f5f5f5; }
                .button { display: inline-block; padding: 12px 24px;
                         background: #00f0ff; color: white; text-decoration: none;
                         border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to CyberPress!</h1>
                </div>
                <div class="content">
                    <h2>Hi {{ username }}!</h2>
                    <p>Thank you for joining CyberPress. Your account has been successfully created.</p>
                    <p>You can now start creating amazing content with our cyberpunk-powered platform.</p>
                    <a href="{{ site_url }}" class="button">Get Started</a>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 CyberPress. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        template = Template(html_template)
        html_content = template.render(
            username=username,
            site_url=os.getenv('FRONTEND_URL', 'http://localhost:3000')
        )

        text_content = f"""
        Hi {username}!

        Welcome to CyberPress! Your account has been successfully created.

        You can now start creating amazing content with our cyberpunk-powered platform.

        If you have any questions, feel free to reach out to our support team.

        Best regards,
        The CyberPress Team
        """

        return await self.send_email(
            to_email=to_email,
            subject="Welcome to CyberPress!",
            html_content=html_content,
            text_content=text_content,
        )

    async def send_password_reset_email(
        self,
        to_email: str,
        username: str,
        reset_token: str,
    ) -> bool:
        """Send password reset email

        Args:
            to_email: User's email address
            username: Username
            reset_token: Password reset token

        Returns:
            True if email sent successfully
        """
        reset_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/reset-password?token={reset_token}"

        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
                         padding: 20px; text-align: center; color: white; }
                .content { padding: 20px; background: #f5f5f5; }
                .button { display: inline-block; padding: 12px 24px;
                         background: #00f0ff; color: white; text-decoration: none;
                         border-radius: 5px; margin: 20px 0; }
                .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hi {{ username }}!</h2>
                    <p>We received a request to reset your password. Click the button below to create a new password.</p>
                    <a href="{{ reset_url }}" class="button">Reset Password</a>
                    <div class="warning">
                        <p><strong>Important:</strong> This link will expire in 1 hour.</p>
                        <p>If you didn't request this password reset, please ignore this email.</p>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2024 CyberPress. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        template = Template(html_template)
        html_content = template.render(
            username=username,
            reset_url=reset_url,
        )

        text_content = f"""
        Hi {username}!

        We received a request to reset your password. Click the link below to create a new password:

        {reset_url}

        Important: This link will expire in 1 hour.

        If you didn't request this password reset, please ignore this email.

        Best regards,
        The CyberPress Team
        """

        return await self.send_email(
            to_email=to_email,
            subject="Reset Your Password",
            html_content=html_content,
            text_content=text_content,
        )

    async def send_comment_notification(
        self,
        to_email: str,
        username: str,
        post_title: str,
        comment_content: str,
        comment_author: str,
    ) -> bool:
        """Send notification for new comment

        Args:
            to_email: Author's email address
            username: Author's username
            post_title: Title of the post
            comment_content: Comment content
            comment_author: Name of commenter

        Returns:
            True if email sent successfully
        """
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
                         padding: 20px; text-align: center; color: white; }
                .content { padding: 20px; background: #f5f5f5; }
                .comment-box { background: white; padding: 15px; border-radius: 5px;
                              border-left: 4px solid #00f0ff; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Comment on Your Post</h1>
                </div>
                <div class="content">
                    <h2>Hi {{ username }}!</h2>
                    <p><strong>{{ comment_author }}</strong> left a comment on your post:</p>
                    <h3>{{ post_title }}</h3>
                    <div class="comment-box">
                        <p>{{ comment_content }}</p>
                    </div>
                    <p>Log in to your dashboard to approve or reply to this comment.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 CyberPress. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        template = Template(html_template)
        html_content = template.render(
            username=username,
            comment_author=comment_author,
            post_title=post_title,
            comment_content=comment_content,
        )

        text_content = f"""
        Hi {username}!

        {comment_author} left a comment on your post "{post_title}":

        {comment_content}

        Log in to your dashboard to approve or reply to this comment.

        Best regards,
        The CyberPress Team
        """

        return await self.send_email(
            to_email=to_email,
            subject=f"New Comment on {post_title}",
            html_content=html_content,
            text_content=text_content,
        )


# Global email service instance
email_service = EmailService()
