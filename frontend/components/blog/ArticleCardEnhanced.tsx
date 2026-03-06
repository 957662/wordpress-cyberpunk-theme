'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from '@/lib/utils';

export interface ArticleCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    id: number;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  viewCount: number;
  commentCount: number;
  likeCount?: number;
  createdAt: string;
  isFeatured?: boolean;
  layout?: 'default' | 'compact' | 'detailed';
}

export function ArticleCardEnhanced({
  id,
  title,
  slug,
  excerpt,
  featuredImage,
  author,
  category,
  tags = [],
  viewCount,
  commentCount,
  likeCount = 0,
  createdAt,
  isFeatured = false,
  layout = 'default'
}: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt));

  if (layout === 'compact') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {featuredImage && (
              <Link href={`/blog/${slug}`} className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                />
              </Link>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={author.avatarUrl} />
                    <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{author.fullName || author.username}</span>
                </div>
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category.name}
                  </Badge>
                )}
              </div>
              <Link href={`/blog/${slug}`}>
                <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                  {title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {viewCount}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (layout === 'detailed') {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
        {featuredImage && (
          <Link href={`/blog/${slug}`} className="relative h-64 block">
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover"
            />
            {isFeatured && (
              <Badge className="absolute top-4 right-4">
                Featured
              </Badge>
            )}
            {category && (
              <Badge className="absolute top-4 left-4" variant="secondary">
                {category.name}
              </Badge>
            )}
          </Link>
        )}
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={author.avatarUrl} />
                <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{author.fullName || author.username}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {timeAgo}
                </p>
              </div>
            </div>
          </div>
          <Link href={`/blog/${slug}`}>
            <h2 className="text-2xl font-bold hover:text-primary transition-colors line-clamp-2">
              {title}
            </h2>
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {excerpt}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                  <Badge variant="outline" className="text-xs">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/blog/${slug}`}>
              Read More
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Default layout
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {featuredImage && (
        <Link href={`/blog/${slug}`} className="relative h-48 block">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFeatured && (
            <Badge className="absolute top-3 right-3">
              Featured
            </Badge>
          )}
        </Link>
      )}
      <CardHeader>
        {category && (
          <Link href={`/blog/category/${category.slug}`} className="inline-block mb-2">
            <Badge variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          </Link>
        )}
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={author.avatarUrl} />
              <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{author.fullName || author.username}</p>
              <p className="text-muted-foreground text-xs">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {viewCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ArticleCardEnhanced;
