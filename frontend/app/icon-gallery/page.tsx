import { Metadata } from 'next';
import IconShowcase from '@/components/icons/IconShowcase';

export const metadata: Metadata = {
  title: 'Icon Gallery | CyberPress',
  description: 'Complete icon gallery for CyberPress platform - 70+ cyberpunk-themed icons',
  keywords: ['icons', 'gallery', 'cyberpress', 'cyberpunk'],
};

export default function IconGalleryPage() {
  return <IconShowcase />;
}
