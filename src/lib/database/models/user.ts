import bcrypt from 'bcryptjs';
import { getDatabase } from '../connection';
import { User, CreateUserData, UpdateUserData } from '../types';

export class UserModel {
  private db = getDatabase();

  async createUser(userData: CreateUserData): Promise<User> {
    const { password, ...userInfo } = userData;
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const stmt = this.db.prepare(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, profile_image_url, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userInfo.username,
      userInfo.email,
      password_hash,
      userInfo.first_name || null,
      userInfo.last_name || null,
      userInfo.profile_image_url || null,
      userInfo.bio || null
    );
    
    const user = this.getUserById(result.lastInsertRowid as number);
    if (!user) {
      throw new Error('Failed to create user');
    }
    
    return user;
  }

  getUserById(id: number): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }

  getUserByEmail(email: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  }

  getUserByUsername(username: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | null;
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updates.length === 0) {
      return this.getUserById(id);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getUserById(id);
  }

  deleteUser(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = this.getUserByEmail(email);
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  }

  getAllUsers(limit: number = 50, offset: number = 0): User[] {
    const stmt = this.db.prepare(`
      SELECT * FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset) as User[];
  }

  getUserCount(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM users');
    const result = stmt.get() as { count: number };
    return result.count;
  }
}