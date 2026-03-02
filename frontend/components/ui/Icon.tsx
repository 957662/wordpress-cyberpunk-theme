'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  animated?: boolean;
  onClick?: () => void;
}

export function Icon({
  name,
  size = 24,
  className = '',
  color = 'cyan',
  animated = false,
  onClick,
}: IconProps) {
  const colorMap = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
    green: 'text-cyber-green',
    orange: 'text-cyber-orange',
  };

  const iconImage = (
    <Image
      src={`/icons/${name}.svg`}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={cn(
        'transition-all duration-300',
        colorMap[color],
        className
      )}
      onClick={onClick}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {iconImage}
      </motion.div>
    );
  }

  return iconImage;
}

// 预定义常用图标组件
export function HomeIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="home" {...props} />;
}

export function SearchIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="search" {...props} />;
}

export function MenuIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="menu" {...props} />;
}

export function BlogIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="blog" {...props} />;
}

export function PortfolioIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="portfolio" {...props} />;
}

export function AboutIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="about" {...props} />;
}

export function GitHubIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="github" {...props} />;
}

export function TwitterIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="twitter" {...props} />;
}

export function LinkedInIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="linkedin" {...props} />;
}

export function EmailIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="email" {...props} />;
}

export function CalendarIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="calendar" {...props} />;
}

export function TagIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="tag" {...props} />;
}

export function CodeIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="code" {...props} />;
}

export function TerminalIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="terminal" {...props} />;
}

export function SettingsIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="settings" {...props} />;
}

export function UserIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="user" {...props} />;
}

export function SunIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="sun" {...props} />;
}

export function MoonIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="moon" {...props} />;
}
