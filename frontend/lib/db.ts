/**
 * Database stub module
 * 提供数据库连接和操作的占位符实现
 */

export interface DbConnection {
  query: (sql: string, params?: any[]) => Promise<any>;
  close: () => Promise<void>;
}

// 创建一个简单的内存数据库stub
const memoryDb: Record<string, any[]> = {};

export const db: DbConnection = {
  async query(sql: string, params?: any[]) {
    console.log('[DB Stub] Query:', sql, params);
    return { rows: [], rowCount: 0 };
  },
  
  async close() {
    console.log('[DB Stub] Connection closed');
  }
};

// 导出默认数据库连接
export default db;
