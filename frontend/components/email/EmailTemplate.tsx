'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EmailTemplateProps {
  subject: string;
  previewText?: string;
  logoUrl?: string;
  children: React.ReactNode;
  footerText?: string;
  unsubscribeUrl?: string;
  className?: string;
}

/**
 * 邮件模板基础组件
 * 提供响应式邮件布局结构
 */
export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  subject,
  previewText,
  logoUrl,
  children,
  footerText = '© 2026 CyberPress Platform. All rights reserved.',
  unsubscribeUrl,
  className
}) => {
  return (
    <div className={cn('email-template', className)}>
      {/* Email Metadata */}
      <meta itemProp="name" content={subject} />
      <meta itemProp="description" content={previewText || subject} />
      {previewText && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #preview-text { display: none; }
            `
          }}
        />
      )}

      {/* Email Container */}
      <div
        className="max-w-[600px] mx-auto bg-cyber-dark"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {previewText && (
          <div
            id="preview-text"
            className="hidden"
            style={{
              display: 'none',
              fontSize: '1px',
              lineHeight: '1px',
              maxHeight: '0px',
              maxWidth: '0px',
              opacity: '0',
              overflow: 'hidden'
            }}
          >
            {previewText}
          </div>
        )}

        {/* Header */}
        <div className="bg-cyber-muted border-b border-cyber-cyan/20 p-8">
          <div className="flex items-center justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="CyberPress Logo"
                className="h-12 w-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold text-cyber-cyan">
                CyberPress
              </h1>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">{children}</div>

        {/* Footer */}
        <div className="bg-cyber-muted/50 border-t border-cyber-cyan/20 p-8">
          <p className="text-sm text-cyber-cyan/60 text-center">
            {footerText}
          </p>
          {unsubscribeUrl && (
            <div className="text-center mt-4">
              <a
                href={unsubscribeUrl}
                className="text-xs text-cyber-cyan/50 hover:text-cyber-cyan"
              >
                Unsubscribe
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * 邮件按钮组件
 */
export const EmailButton: React.FC<EmailButtonProps> = ({
  href,
  children,
  variant = 'primary',
  className
}) => {
  const variantStyles = {
    primary:
      'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
    secondary:
      'bg-cyber-purple text-white hover:bg-cyber-purple/90'
  };

  return (
    <a
      href={href}
      className={cn(
        'inline-block px-6 py-3 rounded-lg font-semibold',
        'text-center transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </a>
  );
};

interface EmailSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 邮件内容区块组件
 */
export const EmailSection: React.FC<EmailSectionProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
};

interface EmailHeadingProps {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

/**
 * 邮件标题组件
 */
export const EmailHeading: React.FC<EmailHeadingProps> = ({
  level = 2,
  children,
  className
}) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  const sizeStyles = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl'
  };

  return (
    <Tag
      className={cn(
        'font-bold text-white mb-4 mt-0',
        sizeStyles[level],
        className
      )}
    >
      {children}
    </Tag>
  );
};

interface EmailTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 邮件文本组件
 */
export const EmailText: React.FC<EmailTextProps> = ({
  children,
  className
}) => {
  return (
    <p className={cn('text-cyber-cyan/80 leading-relaxed mb-4', className)}>
      {children}
    </p>
  );
};

interface EmailDividerProps {
  className?: string;
}

/**
 * 邮件分隔线组件
 */
export const EmailDivider: React.FC<EmailDividerProps> = ({ className }) => {
  return (
    <hr
      className={cn(
        'border-none border-t border-cyber-cyan/20 my-8',
        className
      )}
    />
  );
};

interface EmailImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * 邮件图片组件
 */
export const EmailImage: React.FC<EmailImageProps> = ({
  src,
  alt,
  width,
  height,
  className
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('max-w-full h-auto rounded-lg', className)}
    />
  );
};

export default EmailTemplate;
