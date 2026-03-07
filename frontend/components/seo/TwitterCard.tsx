'use client';

/**
 * Twitter Card Meta Tags Component
 * Adds Twitter Card specific meta tags for better social sharing
 */

import { useEffect } from 'react';

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

export interface TwitterCardProps {
  cardType: TwitterCardType;
  site?: string; // @username of website
  siteId?: string; // Twitter site ID
  creator?: string; // @username of content creator
  creatorId?: string; // Twitter creator ID
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  player?: string;
  playerWidth?: number;
  playerHeight?: number;
  appName?: string;
  appUrl?: {
    iphone?: string;
    ipad?: string;
    googleplay?: string;
  };
}

export function TwitterCard({
  cardType,
  site,
  siteId,
  creator,
  creatorId,
  title,
  description,
  image,
  imageAlt,
  player,
  playerWidth,
  playerHeight,
  appName,
  appUrl,
}: TwitterCardProps) {
  useEffect(() => {
    // Helper function to set meta tag
    const setMetaTag = (name: string, content: string) => {
      const meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (meta) {
        meta.content = content;
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = name;
        newMeta.content = content;
        document.head.appendChild(newMeta);
      }
    };

    // Set Twitter card tags
    setMetaTag('twitter:card', cardType);
    if (site) setMetaTag('twitter:site', site);
    if (siteId) setMetaTag('twitter:site:id', siteId);
    if (creator) setMetaTag('twitter:creator', creator);
    if (creatorId) setMetaTag('twitter:creator:id', creatorId);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);

    if (image) {
      setMetaTag('twitter:image', image);
      if (imageAlt) setMetaTag('twitter:image:alt', imageAlt);
    }

    if (player && cardType === 'player') {
      setMetaTag('twitter:player', player);
      if (playerWidth) setMetaTag('twitter:player:width', playerWidth.toString());
      if (playerHeight) setMetaTag('twitter:player:height', playerHeight.toString());
    }

    if (appName) {
      setMetaTag('twitter:app:name:iphone', appName);
      setMetaTag('twitter:app:name:ipad', appName);
      setMetaTag('twitter:app:name:googleplay', appName);
    }

    if (appUrl) {
      if (appUrl.iphone) setMetaTag('twitter:app:url:iphone', appUrl.iphone);
      if (appUrl.ipad) setMetaTag('twitter:app:url:ipad', appUrl.ipad);
      if (appUrl.googleplay) setMetaTag('twitter:app:url:googleplay', appUrl.googleplay);
    }
  }, [cardType, site, siteId, creator, creatorId, title, description, image, imageAlt, player, playerWidth, playerHeight, appName, appUrl]);

  return null;
}

// Helper component for common Twitter card types

export function TwitterSummaryCard({ title, description, image, imageAlt, site }: {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  site?: string;
}) {
  return (
    <TwitterCard
      cardType="summary"
      title={title}
      description={description}
      image={image}
      imageAlt={imageAlt}
      site={site}
    />
  );
}

export function TwitterLargeImageCard({ title, description, image, imageAlt, site, creator }: {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  site?: string;
  creator?: string;
}) {
  return (
    <TwitterCard
      cardType="summary_large_image"
      title={title}
      description={description}
      image={image}
      imageAlt={imageAlt}
      site={site}
      creator={creator}
    />
  );
}

export default TwitterCard;
