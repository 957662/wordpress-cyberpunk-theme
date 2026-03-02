'use client';

import React from 'react';
import { Mail, Twitter, Github, Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AuthorCardProps {
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
  location?: string;
  email?: string;
  website?: string;
  twitter?: string;
  github?: string;
  className?: string;
}

/**
 * AuthorCard - 作者卡片组件
 * 
 * @example
 * ```tsx
 * <AuthorCard
 *   name="John Doe"
 *   avatar="/avatar.jpg"
 *   bio="Full-stack developer"
 *   role="Senior Developer"
 *   twitter="@johndoe"
 * />
 * ```
 */
export const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  avatar,
  bio,
  role,
  location,
  email,
  website,
  twitter,
  github,
  className = '',
}) => {
  const socialLinks = [
    { icon: Mail, href: `mailto:${email}`, label: 'Email', show: !!email },
    { icon: Twitter, href: `https://twitter.com/${twitter?.replace('@', '')}`, label: 'Twitter', show: !!twitter },
    { icon: Github, href: `https://github.com/${github}`, label: 'GitHub', show: !!github },
    { icon: Globe, href: website, label: 'Website', show: !!website },
  ].filter(link => link.show);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 border border-cyber-cyan/30 rounded-lg bg-[#0a0a0f] ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full border-2 border-cyber-cyan/50 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          {role && (
            <p className="text-sm text-cyber-cyan mb-2">{role}</p>
          )}
          {bio && (
            <p className="text-sm text-gray-400 mb-3">{bio}</p>
          )}
          {location && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple hover:bg-cyber-purple/20 transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Compact version for sidebars
 */
export const AuthorCardCompact: React.FC<Omit<AuthorCardProps, 'bio' | 'location' | 'email'>> = ({
  name,
  avatar,
  role,
  website,
  twitter,
  github,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full border border-cyber-cyan/30 object-cover"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white truncate">{name}</h4>
        {role && <p className="text-xs text-gray-400 truncate">{role}</p>}
      </div>
      <div className="flex items-center gap-2">
        {twitter && (
          <a
            href={`https://twitter.com/${twitter.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-cyber-cyan transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        )}
        {github && (
          <a
            href={`https://github.com/${github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-cyber-cyan transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;
