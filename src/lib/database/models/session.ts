import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../connection';
import { Session, CreateSessionData } from '../types';

export class SessionModel {
  private db = getDatabase();

  createSession(userId: number, expiresInHours: number = 24): Session {
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    const stmt = this.db.prepare(`
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(userId, sessionToken, expiresAt.toISOString());
    
    const session = this.getSessionById(result.lastInsertRowid as number);
    if (!session) {
      throw new Error('Failed to create session');
    }
    
    return session;
  }

  getSessionById(id: number): Session | null {
    const stmt = this.db.prepare('SELECT * FROM sessions WHERE id = ?');
    return stmt.get(id) as Session | null;
  }

  getSessionByToken(token: string): Session | null {
    const stmt = this.db.prepare(`
      SELECT * FROM sessions 
      WHERE session_token = ? AND expires_at > datetime('now')
    `);
    return stmt.get(token) as Session | null;
  }

  getUserSessions(userId: number): Session[] {
    const stmt = this.db.prepare(`
      SELECT * FROM sessions 
      WHERE user_id = ? AND expires_at > datetime('now')
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as Session[];
  }

  deleteSession(token: string): boolean {
    const stmt = this.db.prepare('DELETE FROM sessions WHERE session_token = ?');
    const result = stmt.run(token);
    return result.changes > 0;
  }

  deleteUserSessions(userId: number): number {
    const stmt = this.db.prepare('DELETE FROM sessions WHERE user_id = ?');
    const result = stmt.run(userId);
    return result.changes;
  }

  deleteExpiredSessions(): number {
    const stmt = this.db.prepare(`
      DELETE FROM sessions 
      WHERE expires_at <= datetime('now')
    `);
    const result = stmt.run();
    return result.changes;
  }

  extendSession(token: string, expiresInHours: number = 24): Session | null {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    const stmt = this.db.prepare(`
      UPDATE sessions 
      SET expires_at = ? 
      WHERE session_token = ? AND expires_at > datetime('now')
    `);
    
    const result = stmt.run(expiresAt.toISOString(), token);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.getSessionByToken(token);
  }

  isSessionValid(token: string): boolean {
    const session = this.getSessionByToken(token);
    return session !== null;
  }
}