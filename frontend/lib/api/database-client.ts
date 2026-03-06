/**
 * CyberPress Database API Client
 * 直接与 PostgreSQL 数据库交互的客户端
 *
 * 注意：此客户端仅用于服务端，不能在浏览器中使用
 */

import { Pool, PoolClient, QueryResult } from 'pg';

// 数据库配置
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cyberpress_db',
  user: process.env.DB_USER || 'cyberpress_app',
  password: process.env.DB_PASSWORD,
  max: 20, // 连接池大小
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 创建连接池
let pool: Pool | null = null;

/**
 * 获取数据库连接池
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(DB_CONFIG);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  return pool;
}

/**
 * 数据库查询接口
 */
export interface QueryOptions {
  /**
   * 查询参数
   */
  values?: any[];

  /**
   * 是否返回单个结果
   */
  single?: boolean;

  /**
   * 事务客户端（用于事务中）
   */
  client?: PoolClient;
}

/**
 * 执行数据库查询
 */
export async function query<T = any>(
  text: string,
  options: QueryOptions = {}
): Promise<T[]> {
  const pool = getPool();
  const { values = [], single = false, client } = options;

  const startTime = Date.now();

  try {
    const result: QueryResult = await (client || pool).query(text, values);

    const duration = Date.now() - startTime;

    // 记录慢查询
    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms): ${text}`);
    }

    if (single) {
      return [result.rows[0]] as T[];
    }

    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * 执行查询并返回单个结果
 */
export async function queryOne<T = any>(
  text: string,
  values?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, { values, single: true });
  return rows[0] || null;
}

/**
 * 执行插入并返回插入的数据
 */
export async function insert<T = any>(
  table: string,
  data: Record<string, any>,
  options: { returning?: string[]; client?: PoolClient } = {}
): Promise<T> {
  const { returning = ['*'], client } = options;

  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const text = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
    RETURNING ${returning.join(', ')}
  `;

  const result = await query<T>(text, { values, single: true, client });
  return result[0];
}

/**
 * 执行更新
 */
export async function update(
  table: string,
  id: string,
  data: Record<string, any>,
  options: { client?: PoolClient } = {}
): Promise<void> {
  const { client } = options;

  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

  const text = `
    UPDATE ${table}
    SET ${setClause}
    WHERE id = $1
  `;

  await query(text, { values: [id, ...values], client });
}

/**
 * 执行删除
 */
export async function deleteRow(
  table: string,
  id: string,
  options: { client?: PoolClient } = {}
): Promise<void> {
  const { client } = options;

  const text = `DELETE FROM ${table} WHERE id = $1`;
  await query(text, { values: [id], client });
}

/**
 * 事务处理
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await callback(client);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 批量插入
 */
export async function batchInsert<T = any>(
  table: string,
  columns: string[],
  data: Record<string, any>[][],
  options: { client?: PoolClient } = {}
): Promise<T[]> {
  const { client } = options;

  if (data.length === 0) {
    return [];
  }

  const placeholders = data.map((row, rowIndex) => {
    const rowPlaceholders = row.map((_, colIndex) => {
      const paramIndex = rowIndex * row.length + colIndex + 1;
      return `$${paramIndex}`;
    });
    return `(${rowPlaceholders.join(', ')})`;
  }).join(', ');

  const values = data.flat();

  const text = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES ${placeholders}
    RETURNING *
  `;

  return query<T>(text, { values, client });
}

/**
 * 分页查询
 */
export interface PaginatedOptions {
  limit: number;
  offset: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

export async function paginatedQuery<T = any>(
  table: string,
  where: string = '',
  options: PaginatedOptions,
  client?: PoolClient
): Promise<{ data: T[]; total: number; limit: number; offset: number }> {
  const { limit, offset, orderBy = 'created_at', orderDir = 'DESC' } = options;

  // 查询总数
  const countText = `SELECT COUNT(*) as count FROM ${table} ${where}`;
  const countResult = await queryOne<{ count: string }>(countText, [], client);
  const total = parseInt(countResult?.count || '0');

  // 查询数据
  const dataText = `
    SELECT * FROM ${table}
    ${where}
    ORDER BY ${orderBy} ${orderDir}
    LIMIT $1 OFFSET $2
  `;

  const data = await query<T>(dataText, { values: [limit, offset], client });

  return {
    data,
    total,
    limit,
    offset,
  };
}

/**
 * 关闭连接池
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// ============================================================================
// 用户相关查询
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * 根据邮箱查找用户
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE email = $1 AND status = $2',
    [email, 'active']
  );
}

/**
 * 根据 ID 查找用户
 */
export async function findUserById(id: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE id = $1 AND status = $2',
    [id, 'active']
  );
}

/**
 * 创建用户
 */
export async function createUser(data: {
  email: string;
  password_hash: string;
  name: string;
}): Promise<User> {
  return insert<User>('users', {
    ...data,
    role: 'subscriber',
    status: 'active',
    email_verified: false,
  });
}

// ============================================================================
// 文章相关查询
// ============================================================================

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string;
  category_id: string | null;
  status: string;
  published_at: Date | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 查询已发布的文章列表
 */
export async function findPublishedPosts(options: {
  limit?: number;
  offset?: number;
  category_id?: string;
  author_id?: string;
}): Promise<{ data: Post[]; total: number }> {
  const { limit = 10, offset = 0, category_id, author_id } = options;

  const conditions = ['status = $1'];
  const values: any[] = ['published'];
  let paramIndex = 2;

  if (category_id) {
    conditions.push(`category_id = $${paramIndex++}`);
    values.push(category_id);
  }

  if (author_id) {
    conditions.push(`author_id = $${paramIndex++}`);
    values.push(author_id);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await paginatedQuery<Post>(
    'posts',
    where,
    { limit, offset, orderBy: 'published_at', orderDir: 'DESC' }
  );

  return result;
}

/**
 * 根据 slug 查找文章
 */
export async function findPostBySlug(slug: string): Promise<Post | null> {
  return queryOne<Post>(
    'SELECT * FROM posts WHERE slug = $1 AND status = $2',
    [slug, 'published']
  );
}

/**
 * 增加文章浏览量
 */
export async function incrementPostViews(postId: string): Promise<void> {
  await query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', {
    values: [postId],
  });
}

// ============================================================================
// 评论相关查询
// ============================================================================

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  author_url: string | null;
  author_id: string | null;
  content: string;
  status: string;
  like_count: number;
  depth: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 查询文章的评论
 */
export async function findCommentsByPost(postId: string): Promise<Comment[]> {
  return query<Comment>(
    `SELECT * FROM comments
     WHERE post_id = $1 AND status = $2
     ORDER BY created_at ASC`,
    { values: [postId, 'approved'] }
  );
}

/**
 * 创建评论
 */
export async function createComment(data: {
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  author_url: string | null;
  author_id: string | null;
  content: string;
}): Promise<Comment> {
  return insert<Comment>('comments', {
    ...data,
    status: 'pending',
    depth: 0,
  });
}

// ============================================================================
// 分类和标签
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  post_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  post_count: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 查询所有分类
 */
export async function findAllCategories(): Promise<Category[]> {
  return query<Category>('SELECT * FROM categories ORDER BY sort_order ASC');
}

/**
 * 查询热门标签
 */
export async function findPopularTags(limit: number = 20): Promise<Tag[]> {
  return query<Tag>(
    'SELECT * FROM tags ORDER BY post_count DESC LIMIT $1',
    { values: [limit] }
  );
}

// ============================================================================
// 搜索
// ============================================================================

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  rank: number;
}

/**
 * 全文搜索
 */
export async function searchPosts(
  queryText: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ data: SearchResult[]; total: number }> {
  const { limit = 10, offset = 0 } = options;

  const searchQuery = queryText
    .trim()
    .split(/\s+/)
    .map((word) => word + ':*')
    .join(' & ');

  const countText = `
    SELECT COUNT(*) as count
    FROM posts
    WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', $1)
      AND status = 'published'
  `;

  const countResult = await queryOne<{ count: string }>(countText, [searchQuery]);
  const total = parseInt(countResult?.count || '0');

  const dataText = `
    SELECT
      id,
      title,
      slug,
      excerpt,
      ts_rank(
        to_tsvector('english', title || ' ' || content),
        to_tsquery('english', $1)
      ) as rank
    FROM posts
    WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', $1)
      AND status = 'published'
    ORDER BY rank DESC, published_at DESC
    LIMIT $2 OFFSET $3
  `;

  const data = await query<SearchResult>(dataText, {
    values: [searchQuery, limit, offset],
  });

  return { data, total, limit, offset };
}

// ============================================================================
// 统计
// ============================================================================

export interface DashboardStats {
  total_users: number;
  total_posts: number;
  total_comments: number;
  total_views: number;
}

/**
 * 获取仪表盘统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const result = await queryOne<{
    total_users: string;
    total_posts: string;
    total_comments: string;
    total_views: string;
  }>(
    `
    SELECT
      (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
      (SELECT COUNT(*) FROM posts WHERE status = 'published') as total_posts,
      (SELECT COUNT(*) FROM comments WHERE status = 'approved') as total_comments,
      (SELECT SUM(view_count) FROM posts) as total_views
    `
  );

  return {
    total_users: parseInt(result?.total_users || '0'),
    total_posts: parseInt(result?.total_posts || '0'),
    total_comments: parseInt(result?.total_comments || '0'),
    total_views: parseInt(result?.total_views || '0'),
  };
}

// 导出默认的查询函数
export default {
  query,
  queryOne,
  insert,
  update,
  deleteRow,
  transaction,
  batchInsert,
  paginatedQuery,

  // 用户
  findUserByEmail,
  findUserById,
  createUser,

  // 文章
  findPublishedPosts,
  findPostBySlug,
  incrementPostViews,

  // 评论
  findCommentsByPost,
  createComment,

  // 分类标签
  findAllCategories,
  findPopularTags,

  // 搜索
  searchPosts,

  // 统计
  getDashboardStats,
};
