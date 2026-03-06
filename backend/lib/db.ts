/**
 * Database Client
 * 数据库客户端和连接管理
 */

import { PrismaClient } from '@prisma/client';

// 声明全局类型，防止热重载时创建多个实例
declare global {
  var prisma: PrismaClient | undefined;
}

// 创建 Prisma 客户端实例
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

// 在开发环境中，将实例保存到全局对象
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// =====================================================
// 数据库连接测试
// =====================================================
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// =====================================================
// 优雅关闭连接
// =====================================================
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

// =====================================================
// 数据库健康检查
// =====================================================
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
      status: 'healthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// =====================================================
// 事务辅助函数
// =====================================================
export async function withTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return callback(tx as PrismaClient);
  });
}

// =====================================================
// 批量操作辅助函数
// =====================================================
export async function batchCreate<T>(
  model: any,
  items: T[],
  batchSize: number = 100
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await model.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }
}

export async function batchUpdate<T>(
  model: any,
  updates: Array<{ where: any; data: T }>,
  batchSize: number = 50
): Promise<void> {
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    await Promise.all(
      batch.map((update) =>
        model.update({
          where: update.where,
          data: update.data,
        })
      )
    );
  }
}

// =====================================================
// 分页辅助函数
// =====================================================
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginate<T>(
  model: any,
  params: PaginationParams,
  where: any = {},
  include: any = {},
  orderBy: any = {}
): Promise<PaginatedResult<T>> {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export default prisma;
