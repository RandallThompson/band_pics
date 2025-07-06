import { getDatabase } from '../connection';

export interface Venue {
  id: number;
  name: string;
  location?: string | null;
  website?: string | null;
  created_at: string;
}

export interface CreateVenueData {
  name: string;
  location?: string;
  website?: string;
}

export class VenueModel {
  private db = getDatabase();

  createVenue(data: CreateVenueData): Venue {
    const stmt = this.db.prepare(
      `INSERT INTO venues (name, location, website) VALUES (?, ?, ?)`
    );
    const result = stmt.run(
      data.name,
      data.location || null,
      data.website || null
    );
    const venue = this.getVenueById(result.lastInsertRowid as number);
    if (!venue) throw new Error('Failed to create venue');
    return venue;
  }

  getVenueById(id: number): Venue | null {
    const stmt = this.db.prepare('SELECT * FROM venues WHERE id = ?');
    return stmt.get(id) as Venue | null;
  }

  getAllVenues(): Venue[] {
    const stmt = this.db.prepare('SELECT * FROM venues ORDER BY name');
    return stmt.all() as Venue[];
  }
}
