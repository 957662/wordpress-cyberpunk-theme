/**
 * 用户相关类型定义
 */

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'subscriber';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserProfile extends User {
  website?: string;
  location?: string;
  birthdate?: string;
  interests?: string[];
  social?: SocialLinks;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

export interface UserStats {
  id: string;
  userId: string;
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  sharesCount: number;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  targetType: ActivityTarget;
  targetId: string;
  targetTitle: string;
  createdAt: string;
}

export type ActivityType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'like'
  | 'comment'
  | 'share'
  | 'follow'
  | 'bookmark';

export type ActivityTarget = 
  | 'post'
  | 'comment'
  | 'user'
  | 'category'
  | 'tag';

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  newFollowerAlert: boolean;
  newCommentAlert: boolean;
  newLikeAlert: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  reducedMotion: boolean;
  highContrast: boolean;
  autoplayVideos: boolean;
  showImages: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  interests?: string[];
  social?: SocialLinks;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  token: string;
  password: string;
}

export interface FollowUser {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface UserSearchResult {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}
