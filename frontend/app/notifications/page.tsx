/**
 * Notifications Page
 * Server component wrapper
 */

import { Metadata } from 'next';
import NotificationsClient from './client-page';

export const metadata: Metadata = {
  title: 'Notifications | CyberPress',
  description: 'View all your notifications',
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
