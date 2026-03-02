export { default as CommentSystem } from './CommentSystem';
export { default as CommentList } from './CommentList';
export { default as CommentForm } from './CommentForm';
export type { Comment } from './CommentList';
export type { CommentFormData } from './CommentForm';

// 新增：完整评论系统
export { CommentsSystem } from './CommentsSystem';
export type { Comment as CommentsSystemComment, CommentsSystemProps } from './CommentsSystem';
