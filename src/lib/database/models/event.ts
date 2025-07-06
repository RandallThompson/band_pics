import { getDatabase } from '../connection';

export interface Event {
  id: number;
  venue_id: number;
  title: string;
  date: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  venue_id: number;
  title: string;
  date: string;
  image_url?: string;
}

export interface UpdateEventData {
  venue_id?: number;
  title?: string;
  date?: string;
  image_url?: string;
}

export class EventModel {
  private db = getDatabase();

  createEvent(data: CreateEventData): Event {
    const stmt = this.db.prepare(
      `INSERT INTO events (venue_id, title, date, image_url) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(
      data.venue_id,
      data.title,
      data.date,
      data.image_url || null
    );
    const event = this.getEventById(result.lastInsertRowid as number);
    if (!event) throw new Error('Failed to create event');
    return event;
  }

  getEventById(id: number): Event | null {
    const stmt = this.db.prepare('SELECT * FROM events WHERE id = ?');
    return stmt.get(id) as Event | null;
  }

  getEvents(limit: number = 50, offset: number = 0): Event[] {
    const stmt = this.db.prepare(
      'SELECT * FROM events ORDER BY date DESC LIMIT ? OFFSET ?'
    );
    return stmt.all(limit, offset) as Event[];
  }

  getEventsByVenue(venueId: number, limit: number = 50, offset: number = 0): Event[] {
    const stmt = this.db.prepare(
      'SELECT * FROM events WHERE venue_id = ? ORDER BY date DESC LIMIT ? OFFSET ?'
    );
    return stmt.all(venueId, limit, offset) as Event[];
  }

  updateEvent(id: number, data: UpdateEventData): Event | null {
    const updates: string[] = [];
    const values: any[] = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    if (updates.length === 0) return this.getEventById(id);
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    const stmt = this.db.prepare(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getEventById(id);
  }

  deleteEvent(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM events WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export async function getPastEvents(): Promise<Event[]> {
  const model = new EventModel();
  return model.getEvents();
}

export async function getEventById(id: string): Promise<Event | null> {
  const model = new EventModel();
  return model.getEventById(Number(id));
}
