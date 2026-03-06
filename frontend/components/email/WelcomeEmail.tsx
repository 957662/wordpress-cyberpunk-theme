'use client';

import React from 'react';
import {
  EmailTemplate,
  EmailButton,
  EmailSection,
  EmailHeading,
  EmailText,
  EmailDivider
} from './EmailTemplate';

interface WelcomeEmailProps {
  recipientName: string;
  confirmUrl?: string;
  loginUrl?: string;
  features?: string[];
}

/**
 * 欢迎邮件模板
 * 用于新用户注册后的欢迎邮件
 */
export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  recipientName,
  confirmUrl,
  loginUrl,
  features = [
    'Create and publish blog posts with Markdown support',
    'Customize your profile and connect with others',
    'Follow your favorite authors and topics',
    'Engage with comments and likes'
  ]
}) => {
  return (
    <EmailTemplate
      subject="Welcome to CyberPress Platform 🚀"
      previewText={`Hi ${recipientName}, welcome to CyberPress!`}
      logoUrl="/logo.svg"
    >
      <EmailSection>
        <EmailHeading level={1}>
          Welcome to CyberPress, {recipientName}! 🎉
        </EmailHeading>
        <EmailText>
          We're thrilled to have you join our community of tech enthusiasts
          and content creators. Your journey into the world of cyberpunk
          blogging starts now.
        </EmailText>
      </EmailSection>

      <EmailDivider />

      <EmailSection>
        <EmailHeading level={2}>What You Can Do</EmailHeading>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                <span className="text-cyber-cyan text-sm">✓</span>
              </div>
              <EmailText className="mb-0">{feature}</EmailText>
            </div>
          ))}
        </div>
      </EmailSection>

      <EmailDivider />

      <EmailSection>
        <EmailHeading level={2}>Get Started</EmailHeading>
        <EmailText>
          Ready to dive in? Click the button below to get started with your
          CyberPress journey.
        </EmailText>
        <div className="text-center my-8">
          {confirmUrl ? (
            <EmailButton href={confirmUrl} variant="primary">
              Confirm Your Email
            </EmailButton>
          ) : (
            <EmailButton href={loginUrl || '/login'} variant="primary">
              Start Exploring
            </EmailButton>
          )}
        </div>
      </EmailSection>

      <EmailDivider />

      <EmailSection>
        <EmailHeading level={2}>Need Help?</EmailHeading>
        <EmailText>
          If you have any questions or need assistance, our support team is
          here to help. Check out our documentation or reach out to us
          directly.
        </EmailText>
        <div className="flex gap-4 justify-center mt-6">
          <EmailButton
            href="/docs"
            variant="secondary"
            className="text-sm px-4 py-2"
          >
            Documentation
          </EmailButton>
          <EmailButton
            href="/support"
            variant="secondary"
            className="text-sm px-4 py-2"
          >
            Contact Support
          </EmailButton>
        </div>
      </EmailSection>

      <EmailSection>
        <EmailText className="text-sm text-cyber-cyan/60">
          This email was sent to {recipientName}. If you didn't create an
          account, you can safely ignore this email.
        </EmailText>
      </EmailSection>
    </EmailTemplate>
  );
};

export default WelcomeEmail;
