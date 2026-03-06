'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Link as LinkIcon, Edit, Save, X, Camera, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types
interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface ProfilePageProps {
  user: UserProfile;
  isCurrentUser?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onProfileUpdate?: (updates: Partial<UserProfile>) => Promise<void>;
  onAvatarUpload?: (file: File) => Promise<void>;
  onCoverUpload?: (file: File) => Promise<void>;
  className?: string;
}

export function ProfilePage({
  user,
  isCurrentUser = false,
  onFollow,
  onMessage,
  onProfileUpdate,
  onAvatarUpload,
  onCoverUpload,
  className
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({
    displayName: user.displayName,
    bio: user.bio,
    location: user.location,
    website: user.website,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onProfileUpdate) return;

    setIsSaving(true);
    try {
      await onProfileUpdate(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isCurrentUser && onAvatarUpload) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          await onAvatarUpload(file);
        }
      };
      input.click();
    }
  };

  const handleCoverClick = () => {
    if (isCurrentUser && onCoverUpload) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          await onCoverUpload(file);
        }
      };
      input.click();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className={cn('min-h-screen bg-cyber-dark', className)}>
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwZmYwZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ2LTJoMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        )}
        {isCurrentUser && (
          <button
            onClick={handleCoverClick}
            className="absolute top-4 right-4 px-4 py-2 bg-cyber-dark/80 hover:bg-cyber-dark/90 backdrop-blur-sm rounded-lg text-sm transition-colors"
          >
            <Camera className="w-4 h-4 inline mr-2" />
            更换封面
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6">
              {/* Avatar */}
              <div className="relative -mt-24 mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  <Avatar className="w-40 h-40 ring-4 ring-cyber-cyan/50">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.displayName} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-5xl font-bold">
                        {user.displayName.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  {isCurrentUser && (
                    <button
                      onClick={handleAvatarClick}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-cyber-cyan hover:bg-cyber-cyan/80 rounded-full flex items-center justify-center text-black transition-colors shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Basic Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">{user.displayName}</h1>
                <p className="text-cyber-cyan mb-3">@{user.username}</p>
                {user.bio && !isEditing && (
                  <p className="text-gray-300 text-sm mb-4">{user.bio}</p>
                )}
                {isEditing && (
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    placeholder="介绍一下自己..."
                    className="mb-4 bg-cyber-dark/80"
                  />
                )}

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-400">
                  {user.location && !isEditing && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {isEditing && (
                    <Input
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      placeholder="所在地"
                      className="bg-cyber-dark/80"
                    />
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>加入于 {formatDate(user.joinedAt)}</span>
                  </div>
                  {user.website && !isEditing && (
                    <div className="flex items-center justify-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyber-cyan hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  {isEditing && (
                    <Input
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                      placeholder="个人网站"
                      className="bg-cyber-dark/80"
                    />
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{user.stats.posts}</div>
                  <div className="text-xs text-gray-400">文章</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{user.stats.followers}</div>
                  <div className="text-xs text-gray-400">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{user.stats.following}</div>
                  <div className="text-xs text-gray-400">关注</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{user.stats.likes}</div>
                  <div className="text-xs text-gray-400">获赞</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {isCurrentUser ? (
                  <>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 bg-cyber-green hover:bg-cyber-green/80"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? '保存中...' : '保存'}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedProfile({
                              displayName: user.displayName,
                              bio: user.bio,
                              location: user.location,
                              website: user.website,
                            });
                          }}
                          variant="outline"
                          className="border-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="w-full bg-cyber-cyan hover:bg-cyber-cyan/80 text-black"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          编辑资料
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          设置
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      onClick={onFollow}
                      className="w-full bg-cyber-cyan hover:bg-cyber-cyan/80 text-black"
                    >
                      关注
                    </Button>
                    <Button
                      onClick={onMessage}
                      variant="outline"
                      className="w-full border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      私信
                    </Button>
                  </>
                )}
              </div>

              {/* Social Links */}
              {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                <div className="mt-6 pt-6 border-t border-cyber-cyan/10">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">社交链接</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.socialLinks.github && (
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {user.socialLinks.twitter && (
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-cyber-dark/50 border border-cyber-cyan/20">
                <TabsTrigger value="posts" className="data-[state=active]:bg-cyber-cyan/20">
                  文章
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-cyber-cyan/20">
                  评论
                </TabsTrigger>
                <TabsTrigger value="likes" className="data-[state=active]:bg-cyber-cyan/20">
                  喜欢
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6">
                  <p className="text-gray-400 text-center py-8">暂无文章</p>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6">
                  <p className="text-gray-400 text-center py-8">暂无评论</p>
                </Card>
              </TabsContent>

              <TabsContent value="likes" className="mt-6">
                <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6">
                  <p className="text-gray-400 text-center py-8">暂无喜欢</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
