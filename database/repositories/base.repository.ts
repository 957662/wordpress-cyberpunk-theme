/**
 * Base Repository
 *
 * Provides common database operations for all repositories
 * Implements CRUD operations and common queries
 */

import { PoolClient } from 'pg';
import { query, transaction } from '../connection/database.connection';

export interface FindOptions {
  where?: Record<string, any>;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Base repository class with common CRUD operations
 */
export abstract class BaseRepository<T> {
  protected tableName: string;
  protected primaryKey: string = 'id';

  constructor(tableName: string, primaryKey: string = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Find all records with optional filtering
   */
  async findAll(options: FindOptions = {}): Promise<T[]> {
    const { where, orderBy = this.primaryKey, order = 'ASC', limit, offset } = options;

    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => {
        params.push(where[key]);
        return `${key} = $${paramIndex++}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ORDER BY
    query += ` ORDER BY ${orderBy} ${order}`;

    // Add LIMIT and OFFSET
    if (limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(limit);
    }

    if (offset) {
      query += ` OFFSET $${paramIndex++}`;
      params.push(offset);
    }

    const result = await query(query, params);
    return result.rows;
  }

  /**
   * Find a single record by ID
   */
  async findById(id: string | number): Promise<T | null> {
    const queryText = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    const result = await query(queryText, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find one record by conditions
   */
  async findOne(where: Record<string, any>): Promise<T | null> {
    const options: FindOptions = { where, limit: 1 };
    const results = await this.findAll(options);
    return results[0] || null;
  }

  /**
   * Find records with pagination
   */
  async findPaginated(
    options: PaginationOptions & FindOptions = {}
  ): Promise<PaginatedResult<T>> {
    const { page = 1, pageSize = 10, where } = options;
    const offset = (page - 1) * pageSize;

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const countParams: any[] = [];

    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map((key, i) => {
        countParams.push(where[key]);
        return `${key} = $${i + 1}`;
      });
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated data
    const data = await this.findAll({
      ...options,
      limit: pageSize,
      offset,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const queryText = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await query(queryText, values);
    return result.rows[0];
  }

  /**
   * Create multiple records in a single transaction
   */
  async createMany(dataArray: Partial<T>[]): Promise<T[]> {
    if (dataArray.length === 0) {
      return [];
    }

    return transaction(async (client) => {
      const results: T[] = [];

      for (const data of dataArray) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const queryText = `
          INSERT INTO ${this.tableName} (${keys.join(', ')})
          VALUES (${placeholders})
          RETURNING *
        `;

        const result = await client.query(queryText, values);
        results.push(result.rows[0]);
      }

      return results;
    });
  }

  /**
   * Update a record by ID
   */
  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');

    const queryText = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${this.primaryKey} = $1
      RETURNING *
    `;

    const result = await query(queryText, [id, ...values]);
    return result.rows[0] || null;
  }

  /**
   * Update multiple records
   */
  async updateMany(where: Record<string, any>, data: Partial<T>): Promise<T[]> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    let queryText = `UPDATE ${this.tableName} SET ${setClause}`;
    const params: any[] = [...values];
    let paramIndex = keys.length + 1;

    // Build WHERE clause
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => {
        params.push(where[key]);
        return `${key} = $${paramIndex++}`;
      });
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryText += ' RETURNING *';

    const result = await query(queryText, params);
    return result.rows;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<boolean> {
    const queryText = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    const result = await query(queryText, [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Delete multiple records
   */
  async deleteMany(where: Record<string, any>): Promise<number> {
    let queryText = `DELETE FROM ${this.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => {
        params.push(where[key]);
        return `${key} = $${paramIndex++}`;
      });
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await query(queryText, params);
    return result.rowCount || 0;
  }

  /**
   * Count records
   */
  async count(where?: Record<string, any>): Promise<number> {
    let queryText = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params: any[] = [];

    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map((key, i) => {
        params.push(where[key]);
        return `${key} = $${i + 1}`;
      });
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  }

  /**
   * Check if a record exists
   */
  async exists(id: string | number): Promise<boolean> {
    const queryText = `SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} = $1 LIMIT 1`;
    const result = await query(queryText, [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Execute raw SQL query
   */
  protected async executeRaw<R = any>(sql: string, params?: any[]): Promise<R[]> {
    const result = await query<R>(sql, params);
    return result.rows;
  }
}

export default BaseRepository;
