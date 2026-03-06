/**
 * Database Connection Manager
 *
 * Manages database connections, connection pooling, and provides
 * a singleton instance of the database connection
 */

import { Pool, PoolClient, QueryResult } from 'pg';
import { getDatabaseConfig, poolConfig } from '../config/database.config';

/**
 * Database connection manager singleton
 */
class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private pool: Pool | null = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private readonly maxRetries: number = 3;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  /**
   * Initialize database connection pool
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    const config = getDatabaseConfig();

    try {
      this.pool = new Pool({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.username,
        password: config.password,
        max: poolConfig.max,
        min: poolConfig.min,
        idleTimeoutMillis: poolConfig.idle,
        connectionTimeoutMillis: poolConfig.acquire,
      });

      // Test connection
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();

      console.log('Database connected successfully at:', result.rows[0].now);
      this.isConnected = true;

      // Setup error handlers
      this.pool.on('error', (err) => {
        console.error('Unexpected database pool error:', err);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Failed to connect to database:', error);
      this.connectionAttempts++;

      if (this.connectionAttempts < this.maxRetries) {
        console.log(`Retrying connection... (Attempt ${this.connectionAttempts}/${this.maxRetries})`);
        await this.delay(2000 * this.connectionAttempts);
        return this.connect();
      }

      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('Database disconnected');
    }
  }

  /**
   * Get a client from the pool
   */
  public async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call connect() first.');
    }

    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      console.error('Failed to get database client:', error);
      throw error;
    }
  }

  /**
   * Execute a query
   */
  public async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call connect() first.');
    }

    const start = Date.now();

    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text, duration, rows: result.rowCount });
      }

      return result;
    } catch (error) {
      console.error('Query error:', { text, params, error });
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();

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
   * Check if database is connected
   */
  public isConnectedToDatabase(): boolean {
    return this.isConnected && this.pool !== null;
  }

  /**
   * Get pool statistics
   */
  public getPoolStats() {
    if (!this.pool) {
      return null;
    }

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }

  /**
   * Utility function to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const db = DatabaseConnectionManager.getInstance();

// Export convenience functions
export async function connectToDatabase(): Promise<void> {
  return db.connect();
}

export async function disconnectFromDatabase(): Promise<void> {
  return db.disconnect();
}

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  return db.query<T>(text, params);
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  return db.transaction(callback);
}

export default db;
