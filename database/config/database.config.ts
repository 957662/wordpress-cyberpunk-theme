/**
 * Database Configuration
 *
 * Central database configuration for CyberPress Platform
 * Supports PostgreSQL, MySQL, and SQLite
 */

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'sqlite';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  migrations: string[];
}

/**
 * Development Database Configuration
 */
export const devDatabaseConfig: DatabaseConfig = {
  type: 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cyberpress_dev',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  synchronize: true,
  logging: true,
  entities: ['dist/backend/app/models/**/*.js'],
  migrations: ['dist/backend/database/migrations/**/*.js'],
};

/**
 * Production Database Configuration
 */
export const prodDatabaseConfig: DatabaseConfig = {
  type: 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cyberpress_prod',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: false,
  entities: ['dist/backend/app/models/**/*.js'],
  migrations: ['dist/backend/database/migrations/**/*.js'],
};

/**
 * Test Database Configuration
 */
export const testDatabaseConfig: DatabaseConfig = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: ['dist/backend/app/models/**/*.js'],
  migrations: [],
};

/**
 * Get database configuration based on environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return prodDatabaseConfig;
    case 'test':
      return testDatabaseConfig;
    case 'development':
    default:
      return devDatabaseConfig;
  }
}

/**
 * Database connection pool configuration
 */
export const poolConfig = {
  max: 20, // Maximum number of connections in the pool
  min: 5, // Minimum number of connections in the pool
  idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
  acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
};

/**
 * Database query timeouts (in milliseconds)
 */
export const queryTimeouts = {
  default: 5000, // 5 seconds
  slow: 1000, // 1 second
  critical: 10000, // 10 seconds
};

/**
 * Cache configuration for database queries
 */
export const cacheConfig = {
  enabled: process.env.DB_CACHE_ENABLED === 'true',
  duration: parseInt(process.env.DB_CACHE_DURATION || '300000'), // 5 minutes default
  maxSize: parseInt(process.env.DB_CACHE_MAX_SIZE || '1000'), // Maximum number of cached queries
};

export default getDatabaseConfig;
