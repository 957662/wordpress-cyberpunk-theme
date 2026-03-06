"""
邮件服务
提供邮件发送功能
"""

import os
from typing import Optional
from datetime import datetime


class EmailService:
    """邮件服务类"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@cyberpress.com")
        self.from_name = os.getenv("FROM_NAME", "CyberPress")
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
    ) -> bool:
        """
        发送邮件
        
        Args:
            to_email: 收件人邮箱
            subject: 邮件主题
            html_content: HTML内容
            text_content: 纯文本内容
        
        Returns:
            发送成功返回True
        """
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        try:
            # 创建邮件
            msg = MIMEMultipart('alternative')
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # 添加纯文本内容
            if text_content:
                msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
            
            # 添加HTML内容
            msg.attach(MIMEText(html_content, 'html', 'utf-8'))
            
            # 发送邮件
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"发送邮件失败: {e}")
            return False


async def send_verification_email(
    email: str,
    username: str,
    verification_url: str,
) -> bool:
    """
    发送验证邮件
    
    Args:
        email: 收件人邮箱
        username: 用户名
        verification_url: 验证链接
    
    Returns:
        发送成功返回True
    """
    email_service = EmailService()
    
    subject = "验证您的邮箱地址 - CyberPress"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>欢迎来到 CyberPress</h1>
        </div>
        <div class="content">
            <p>你好，<strong>{username}</strong>！</p>
            <p>感谢您注册 CyberPress。请点击下面的按钮验证您的邮箱地址：</p>
            <p style="text-align: center;">
                <a href="{verification_url}" class="button">验证邮箱</a>
            </p>
            <p>或者复制以下链接到浏览器中打开：</p>
            <p style="word-break: break-all; color: #666;">{verification_url}</p>
            <p><strong>此链接将在24小时后过期。</strong></p>
        </div>
        <div class="footer">
            <p>如果这不是您的操作，请忽略此邮件。</p>
            <p>&copy; {datetime.now().year} CyberPress. All rights reserved.</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    你好，{username}！
    
    感谢您注册 CyberPress。请访问以下链接验证您的邮箱地址：
    
    {verification_url}
    
    此链接将在24小时后过期。
    
    如果这不是您的操作，请忽略此邮件。
    
    © {datetime.now().year} CyberPress. All rights reserved.
    """
    
    return await email_service.send_email(
        to_email=email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )


async def send_password_reset_email(
    email: str,
    username: str,
    reset_url: str,
) -> bool:
    """
    发送密码重置邮件
    
    Args:
        email: 收件人邮箱
        username: 用户名
        reset_url: 重置链接
    
    Returns:
        发送成功返回True
    """
    email_service = EmailService()
    
    subject = "重置您的密码 - CyberPress"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
            .warning {{
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>密码重置请求</h1>
        </div>
        <div class="content">
            <p>你好，<strong>{username}</strong>！</p>
            <p>我们收到了您的密码重置请求。请点击下面的按钮重置密码：</p>
            <p style="text-align: center;">
                <a href="{reset_url}" class="button">重置密码</a>
            </p>
            <p>或者复制以下链接到浏览器中打开：</p>
            <p style="word-break: break-all; color: #666;">{reset_url}</p>
            <div class="warning">
                <strong>⚠️ 重要提示：</strong><br>
                此链接将在1小时后过期。<br>
                如果这不是您的操作，请立即联系我们的支持团队。
            </div>
        </div>
        <div class="footer">
            <p>如果这不是您的操作，请忽略此邮件，您的密码不会被更改。</p>
            <p>&copy; {datetime.now().year} CyberPress. All rights reserved.</p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    你好，{username}！
    
    我们收到了您的密码重置请求。请访问以下链接重置密码：
    
    {reset_url}
    
    此链接将在1小时后过期。
    
    如果这不是您的操作，请忽略此邮件，您的密码不会被更改。
    
    © {datetime.now().year} CyberPress. All rights reserved.
    """
    
    return await email_service.send_email(
        to_email=email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )
