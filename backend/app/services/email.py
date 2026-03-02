"""
邮件发送服务
支持 SMTP、邮件模板、批量发送、队列管理
"""

import os
import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from jinja2 import Template
import aiofiles
import json

from fastapi import BackgroundTasks
from pydantic import EmailStr


@dataclass
class EmailAttachment:
    """邮件附件"""
    filename: str
    content: bytes
    content_type: str = "application/octet-stream"


@dataclass
class EmailRecipient:
    """邮件接收者"""
    email: EmailStr
    name: Optional[str] = None
    variables: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EmailTemplate:
    """邮件模板"""
    name: str
    subject: str
    html_content: str
    text_content: Optional[str] = None
    variables: List[str] = field(default_factory=list)


@dataclass
class EmailMessage:
    """邮件消息"""
    recipients: List[EmailRecipient]
    template: EmailTemplate
    from_name: Optional[str] = None
    from_email: Optional[EmailStr] = None
    reply_to: Optional[EmailStr] = None
    attachments: List[EmailAttachment] = field(default_factory=list)
    cc: List[EmailStr] = field(default_factory=list)
    bcc: List[EmailStr] = field(default_factory=list)
    priority: int = 3  # 1=highest, 5=lowest
    scheduled_at: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EmailLog:
    """邮件发送日志"""
    id: str
    message: EmailMessage
    status: str = "pending"  # pending, sent, failed, retrying
    attempts: int = 0
    max_attempts: int = 3
    last_attempt: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)


class EmailTemplateManager:
    """邮件模板管理器"""

    def __init__(self, template_dir: str = "templates/emails"):
        self.template_dir = template_dir
        self.templates: Dict[str, EmailTemplate] = {}
        self._load_templates()

    def _load_templates(self):
        """加载所有邮件模板"""
        try:
            template_files = [
                ("welcome.html", "Welcome to Our Platform", ["username", "verification_url"]),
                ("password_reset.html", "Reset Your Password", ["username", "reset_url"]),
                ("email_verification.html", "Verify Your Email", ["username", "verification_url"]),
                ("notification.html", "New Notification", ["username", "message", "action_url"]),
                ("newsletter.html", "Weekly Newsletter", ["username", "content", "unsubscribe_url"]),
            ]

            for filename, subject, variables in template_files:
                self.templates[filename] = EmailTemplate(
                    name=filename.replace(".html", ""),
                    subject=subject,
                    html_content=self._load_template_content(filename),
                    variables=variables
                )
        except Exception as e:
            print(f"Error loading email templates: {e}")

    def _load_template_content(self, filename: str) -> str:
        """加载模板内容"""
        try:
            template_path = os.path.join(self.template_dir, filename)
            if os.path.exists(template_path):
                with open(template_path, 'r', encoding='utf-8') as f:
                    return f.read()

            # 返回默认模板
            return self._get_default_template(filename)
        except Exception:
            return self._get_default_template(filename)

    def _get_default_template(self, filename: str) -> str:
        """获取默认模板"""
        default_templates = {
            "welcome.html": """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; background: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background: #00f0ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to CyberPress!</h1>
                    </div>
                    <div class="content">
                        <p>Hi {{ username }},</p>
                        <p>Welcome to our platform! We're excited to have you on board.</p>
                        <p>To get started, please verify your email address by clicking the button below:</p>
                        <a href="{{ verification_url }}" class="button">Verify Email</a>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 CyberPress Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            "password_reset.html": """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #9d00ff 0%, #ff0080 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; background: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background: #9d00ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hi {{ username }},</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <a href="{{ reset_url }}" class="button">Reset Password</a>
                        <div class="warning">
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request this, please ignore this email.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 CyberPress Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
        }

        return default_templates.get(filename, "<html><body><h1>Email Template</h1><p>{{ content }}</p></body></html>")

    def get_template(self, name: str) -> Optional[EmailTemplate]:
        """获取邮件模板"""
        return self.templates.get(name)

    def render_template(self, template: EmailTemplate, variables: Dict[str, Any]) -> str:
        """渲染邮件模板"""
        try:
            jinja_template = Template(template.html_content)
            return jinja_template.render(**variables)
        except Exception as e:
            print(f"Error rendering template: {e}")
            return template.html_content


class EmailService:
    """邮件发送服务"""

    def __init__(
        self,
        smtp_host: str = None,
        smtp_port: int = 587,
        smtp_username: str = None,
        smtp_password: str = None,
        from_email: EmailStr = None,
        from_name: str = None,
        use_tls: bool = True,
    ):
        self.smtp_host = smtp_host or os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = smtp_port or int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = smtp_username or os.getenv("SMTP_USERNAME")
        self.smtp_password = smtp_password or os.getenv("SMTP_PASSWORD")
        self.from_email = from_email or os.getenv("FROM_EMAIL", "noreply@cyberpress.dev")
        self.from_name = from_name or os.getenv("FROM_NAME", "CyberPress Platform")
        self.use_tls = use_tls

        self.template_manager = EmailTemplateManager()
        self.email_queue: List[EmailLog] = []
        self.sent_emails: List[EmailLog] = []

    def _create_message(
        self,
        recipient: EmailRecipient,
        template: EmailTemplate,
        html_content: str,
        text_content: Optional[str] = None,
        reply_to: Optional[EmailStr] = None,
        cc: List[EmailStr] = None,
        bcc: List[EmailStr] = None,
    ) -> MIMEMultipart:
        """创建邮件消息"""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = template.subject
        msg["From"] = formataddr((self.from_name, self.from_email))
        msg["To"] = formataddr((recipient.name, recipient.email)) if recipient.name else recipient.email

        if reply_to:
            msg["Reply-To"] = reply_to

        if cc:
            msg["Cc"] = ", ".join(cc)

        if bcc:
            msg["Bcc"] = ", ".join(bcc)

        # 添加文本内容
        if text_content:
            msg.attach(MIMEText(text_content, "plain", "utf-8"))

        # 添加 HTML 内容
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        return msg

    async def send_email(
        self,
        message: EmailMessage,
        background_tasks: BackgroundTasks = None,
    ) -> EmailLog:
        """发送邮件"""
        import uuid

        email_log = EmailLog(
            id=str(uuid.uuid4()),
            message=message,
            scheduled_at=message.scheduled_at or datetime.now()
        )

        # 添加到队列
        self.email_queue.append(email_log)

        # 如果提供了后台任务，则在后台发送
        if background_tasks:
            background_tasks.add_task(self._process_queue)
        else:
            await self._process_queue()

        return email_log

    async def _process_queue(self):
        """处理邮件队列"""
        while self.email_queue:
            email_log = self.email_queue.pop(0)

            # 检查是否到了发送时间
            if email_log.scheduled_at and email_log.scheduled_at > datetime.now():
                self.email_queue.insert(0, email_log)
                await asyncio.sleep(60)
                continue

            await self._send_email_log(email_log)

    async def _send_email_log(self, email_log: EmailLog):
        """发送单个邮件日志"""
        email_log.last_attempt = datetime.now()
        email_log.attempts += 1

        try:
            for recipient in email_log.message.recipients:
                # 渲染模板
                variables = {**recipient.variables}
                html_content = self.template_manager.render_template(
                    email_log.message.template,
                    variables
                )

                # 创建邮件消息
                msg = self._create_message(
                    recipient,
                    email_log.message.template,
                    html_content,
                    email_log.message.template.text_content,
                    email_log.message.reply_to,
                    email_log.message.cc,
                    email_log.message.bcc,
                )

                # 发送邮件
                await self._send_smtp(msg, recipient.email)

            email_log.status = "sent"
            email_log.sent_at = datetime.now()
            self.sent_emails.append(email_log)

        except Exception as e:
            email_log.status = "failed"
            email_log.error_message = str(e)

            # 如果未超过最大重试次数，则重试
            if email_log.attempts < email_log.max_attempts:
                email_log.status = "retrying"
                self.email_queue.append(email_log)

            print(f"Error sending email: {e}")

    async def _send_smtp(self, msg: MIMEMultipart, to_email: EmailStr):
        """通过 SMTP 发送邮件"""
        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()

                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)

                server.send_message(msg)
                server.quit()

        except Exception as e:
            raise Exception(f"SMTP error: {e}")

    def send_welcome_email(
        self,
        recipient: EmailRecipient,
        verification_url: str,
        background_tasks: BackgroundTasks = None,
    ) -> EmailLog:
        """发送欢迎邮件"""
        template = self.template_manager.get_template("welcome")
        if not template:
            raise ValueError("Welcome template not found")

        message = EmailMessage(
            recipients=[recipient],
            template=template,
        )

        return asyncio.create_task(self.send_email(message, background_tasks))

    def send_password_reset_email(
        self,
        recipient: EmailRecipient,
        reset_url: str,
        background_tasks: BackgroundTasks = None,
    ) -> EmailLog:
        """发送密码重置邮件"""
        template = self.template_manager.get_template("password_reset")
        if not template:
            raise ValueError("Password reset template not found")

        message = EmailMessage(
            recipients=[recipient],
            template=template,
        )

        return asyncio.create_task(self.send_email(message, background_tasks))

    def send_bulk_email(
        self,
        recipients: List[EmailRecipient],
        template_name: str,
        background_tasks: BackgroundTasks = None,
    ) -> List[EmailLog]:
        """批量发送邮件"""
        template = self.template_manager.get_template(template_name)
        if not template:
            raise ValueError(f"Template '{template_name}' not found")

        logs = []
        for recipient in recipients:
            message = EmailMessage(
                recipients=[recipient],
                template=template,
            )
            log = asyncio.create_task(self.send_email(message, background_tasks))
            logs.append(log)

        return logs

    def get_email_status(self, email_id: str) -> Optional[EmailLog]:
        """获取邮件发送状态"""
        return next((log for log in self.sent_emails if log.id == email_id), None)

    def get_queue_size(self) -> int:
        """获取队列大小"""
        return len(self.email_queue)

    def clear_old_logs(self, days: int = 30):
        """清除旧日志"""
        cutoff_date = datetime.now() - timedelta(days=days)
        self.sent_emails = [
            log for log in self.sent_emails
            if log.created_at > cutoff_date
        ]


# 单例实例
_email_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """获取邮件服务单例"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
