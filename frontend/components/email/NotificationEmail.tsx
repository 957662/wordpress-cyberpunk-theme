'use client';

import React from 'react';
import {
  EmailTemplate,
  EmailButton,
  EmailSection,
  EmailHeading,
  EmailText
} from './EmailTemplate';

interface NotificationEmailProps {
  recipientName: string;
  notificationType: 'comment' | 'like' | 'follow' | 'mention' | 'custom';
  actorName?: string;
  actorAvatar?: string;
  content?: string;
  targetUrl?: string;
  customMessage?: string;
  timeAgo?: string;
}

/**
 * 通知邮件模板
 * 用于各种用户通知（评论、点赞、关注等）
 */
export const NotificationEmail: React.FC<NotificationEmailProps> = ({
  recipientName,
  notificationType,
  actorName,
  actorAvatar,
  content,
  targetUrl,
  customMessage,
  timeAgo = 'just now'
}) => {
  const getNotificationTitle = () => {
    switch (notificationType) {
      case 'comment':
        return `New Comment from ${actorName}`;
      case 'like':
        return `${actorName} liked your post`;
      case 'follow':
        return `${actorName} started following you`;
      case 'mention':
        return `${actorName} mentioned you`;
      case 'custom':
        return 'New Notification';
      default:
        return 'New Notification';
    }
  };

  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'follow':
        return '👤';
      case 'mention':
        return '@';
      case 'custom':
        return '🔔';
      default:
        return '🔔';
    }
  };

  return (
    <EmailTemplate
      subject={getNotificationTitle()}
      previewText={`You have a new ${notificationType} on CyberPress`}
    >
      <EmailSection>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">{getNotificationIcon()}</div>
          <div>
            <EmailHeading level={2} className="mb-1">
              {getNotificationTitle()}
            </EmailHeading>
            <p className="text-sm text-cyber-cyan/60">{timeAgo}</p>
          </div>
        </div>
      </EmailSection>

      <EmailDivider />

      <EmailSection>
        {actorAvatar && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src={actorAvatar}
              alt={actorName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-white">{actorName}</p>
              <p className="text-sm text-cyber-cyan/60">CyberPress User</p>
            </div>
          </div>
        )}

        {content && (
          <div className="bg-cyber-muted/50 rounded-lg p-4 border border-cyber-cyan/20">
            <p className="text-cyber-cyan/80 leading-relaxed">{content}</p>
          </div>
        )}

        {customMessage && (
          <EmailText>{customMessage}</EmailText>
        )}

        {targetUrl && (
          <div className="text-center mt-8">
            <EmailButton href={targetUrl} variant="primary">
              View Now
            </EmailButton>
          </div>
        )}
      </EmailSection>

      <EmailSection>
        <EmailText className="text-sm">
          You're receiving this email because you have notifications enabled
          on CyberPress Platform.
        </EmailText>
        <EmailText className="text-sm">
          To manage your notification preferences, visit your{' '}
          <a
            href="/settings/notifications"
            className="text-cyber-cyan hover:underline"
          >
            notification settings
          </a>
          .
        </EmailText>
      </EmailSection>
    </EmailTemplate>
  );
};

export default NotificationEmail;
