import { getDatabase } from '../connection';
import { Photo, CreatePhotoData, UpdatePhotoData } from '../types';

export class PhotoModel {
  private db = getDatabase();

  createPhoto(photoData: CreatePhotoData): Photo {
    const stmt = this.db.prepare(`
      INSERT INTO photos (
        user_id, event_id, blob_url, caption, alt_text, genre, is_public
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      photoData.user_id,
      photoData.event_id || null,
      photoData.blob_url,
      photoData.caption || null,
      photoData.alt_text || null,
      photoData.genre || null,
      photoData.is_public !== false ? 1 : 0
    );
    
    const photo = this.getPhotoById(result.lastInsertRowid as number);
    if (!photo) {
      throw new Error('Failed to create photo');
    }
    
    return photo;
  }

  getPhotoById(id: number): Photo | null {
    const stmt = this.db.prepare('SELECT * FROM photos WHERE id = ?');
    return stmt.get(id) as Photo | null;
  }

  getAllPhotos(limit: number = 50, offset: number = 0): Photo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM photos 
      WHERE is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset) as Photo[];
  }

  getPhotosByUser(userId: number, limit: number = 50, offset: number = 0): Photo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM photos 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset) as Photo[];
  }

  getPhotosByEvent(eventId: number, limit: number = 50, offset: number = 0): Photo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM photos 
      WHERE event_id = ? AND is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(eventId, limit, offset) as Photo[];
  }

  getPhotosByGenre(genre: string, limit: number = 50, offset: number = 0): Photo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM photos 
      WHERE genre = ? AND is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    return stmt.all(genre, limit, offset) as Photo[];
  }

  updatePhoto(id: number, photoData: UpdatePhotoData): Photo | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'is_public') {
          updates.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) {
      return this.getPhotoById(id);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE photos 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getPhotoById(id);
  }

  deletePhoto(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM photos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  searchPhotos(query: string, limit: number = 50, offset: number = 0): Photo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM photos 
      WHERE (caption LIKE ? OR alt_text LIKE ? OR genre LIKE ?) AND is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm, limit, offset) as Photo[];
  }

  getPhotoCount(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM photos WHERE is_public = 1');
    const result = stmt.get() as { count: number };
    return result.count;
  }
}