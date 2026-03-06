/**
 * User Repository
 *
 * Handles database operations for users
 */

import { BaseRepository } from './base.repository';
import { query } from '../connection/database.connection';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  role: 'admin' | 'author' | 'user';
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role?: 'admin' | 'author' | 'user';
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  role?: 'admin' | 'author' | 'user';
  is_active?: boolean;
  is_verified?: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    admin: number;
    author: number;
    user: number;
  };
}

/**
 * User repository class
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users', 'id');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ username });
  }

  /**
   * Find user by email or username
   */
  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const queryText = `
      SELECT * FROM ${this.tableName}
      WHERE email = $1 OR username = $1
      LIMIT 1
    `;
    const result = await query(queryText, [emailOrUsername]);
    return result.rows[0] || null;
  }

  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<User> {
    // Hash password (in real implementation, use bcrypt)
    const password_hash = await this.hashPassword(input.password);

    const user: Partial<User> = {
      username: input.username,
      email: input.email,
      password_hash,
      full_name: input.full_name,
      role: input.role || 'user',
      is_active: true,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return this.create(user);
  }

  /**
   * Update user
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    const updateData: Partial<User> = {
      ...input,
      updated_at: new Date(),
    };

    return this.update(id, updateData);
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.update(id, {
      last_login_at: new Date() as any,
    } as Partial<User>);
  }

  /**
   * Change user password
   */
  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const password_hash = await this.hashPassword(newPassword);
    const result = await this.update(id, {
      password_hash,
      updated_at: new Date() as any,
    } as Partial<User>);

    return result !== null;
  }

  /**
   * Activate user account
   */
  async activateUser(id: string): Promise<User | null> {
    return this.update(id, {
      is_active: true,
      is_verified: true,
      updated_at: new Date() as any,
    } as Partial<User>);
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(id: string): Promise<User | null> {
    return this.update(id, {
      is_active: false,
      updated_at: new Date() as any,
    } as Partial<User>);
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const totalUsersResult = await query(
      'SELECT COUNT(*) as total FROM users WHERE is_active = true'
    );

    const newUsersResult = await query(`
      SELECT COUNT(*) as total
      FROM users
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND is_active = true
    `);

    const usersByRoleResult = await query(`
      SELECT role, COUNT(*) as total
      FROM users
      WHERE is_active = true
      GROUP BY role
    `);

    const usersByRole = {
      admin: 0,
      author: 0,
      user: 0,
    };

    usersByRoleResult.rows.forEach(row => {
      usersByRole[row.role as keyof typeof usersByRole] = parseInt(row.total);
    });

    return {
      totalUsers: parseInt(totalUsersResult.rows[0].total),
      activeUsers: parseInt(totalUsersResult.rows[0].total), // Assuming all active users
      newUsersThisMonth: parseInt(newUsersResult.rows[0].total),
      usersByRole,
    };
  }

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string, limit: number = 10): Promise<User[]> {
    const queryText = `
      SELECT * FROM ${this.tableName}
      WHERE username ILIKE $1
         OR email ILIKE $1
         OR full_name ILIKE $1
      ORDER BY username
      LIMIT $2
    `;
    const result = await query(queryText, [`${searchTerm}%`, limit]);
    return result.rows;
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: 'admin' | 'author' | 'user'): Promise<User[]> {
    return this.findAll({
      where: { role },
      orderBy: 'username',
    });
  }

  /**
   * Verify password (in real implementation, use bcrypt.compare)
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    // In production, use bcrypt.compare(password, user.password_hash)
    // This is a simplified version
    return user.password_hash === this.hashPasswordSync(password);
  }

  /**
   * Hash password (in real implementation, use bcrypt)
   */
  private async hashPassword(password: string): Promise<string> {
    // In production, use bcrypt.hash(password, 10)
    // This is a simplified version
    return `hashed_${password}`;
  }

  /**
   * Hash password synchronously (for comparison)
   */
  private hashPasswordSync(password: string): string {
    return `hashed_${password}`;
  }
}

// Export singleton instance
export const userRepository = new UserRepository();

export default UserRepository;
