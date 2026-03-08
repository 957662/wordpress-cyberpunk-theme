/**
 * Social Service - 社交功能服务层
 * 处理点赞、收藏、评论、关注等社交功能
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: Comment[];
}

export interface LikeResponse {
  success: boolean;
  isLiked: boolean;
  likesCount: number;
}

export interface BookmarkResponse {
  success: boolean;
  isBookmarked: boolean;
  bookmarksCount: number;
}

/**
 * 点赞文章
 */
export async function likePost(postId: string): Promise<LikeResponse> {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to like post');
  }

  return response.json();
}

/**
 * 取消点赞文章
 */
export async function unlikePost(postId: string): Promise<LikeResponse> {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/like`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to unlike post');
  }

  return response.json();
}

/**
 * 收藏文章
 */
export async function bookmarkPost(postId: string): Promise<BookmarkResponse> {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to bookmark post');
  }

  return response.json();
}

/**
 * 取消收藏文章
 */
export async function unbookmarkPost(postId: string): Promise<BookmarkResponse> {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/bookmark`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to unbookmark post');
  }

  return response.json();
}

/**
 * 获取文章评论
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

/**
 * 发表评论
 */
export async function createComment(
  postId: string,
  content: string,
  parentId?: string
): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      parentId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return response.json();
}

/**
 * 删除评论
 */
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/social/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });
}

/**
 * 点赞评论
 */
export async function likeComment(commentId: string): Promise<LikeResponse> {
  const response = await fetch(`${API_BASE_URL}/social/comments/${commentId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to like comment');
  }

  return response.json();
}

/**
 * 关注用户
 */
export async function followUser(userId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/social/users/${userId}/follow`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to follow user');
  }

  return response.json();
}

/**
 * 取消关注用户
 */
export async function unfollowUser(userId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/social/users/${userId}/follow`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to unfollow user');
  }

  return response.json();
}

/**
 * 获取用户的关注状态
 */
export async function getFollowStatus(userId: string): Promise<{
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}> {
  const response = await fetch(`${API_BASE_URL}/social/users/${userId}/status`);

  if (!response.ok) {
    throw new Error('Failed to fetch follow status');
  }

  return response.json();
}

/**
 * 分享文章（记录分享次数）
 */
export async function sharePost(postId: string, platform: string): Promise<void> {
  await fetch(`${API_BASE_URL}/social/posts/${postId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ platform }),
  });
}
