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

export interface EventWithVenue extends Event {
  venue: string;
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

  getEventWithVenue(id: number): EventWithVenue | null {
    const stmt = this.db.prepare(
      `SELECT e.*, v.name AS venue FROM events e JOIN venues v ON e.venue_id = v.id WHERE e.id = ?`
    );
    return stmt.get(id) as EventWithVenue | null;
  }

  getEvents(limit: number = 50, offset: number = 0): Event[] {
    const stmt = this.db.prepare(
      'SELECT * FROM events ORDER BY date DESC LIMIT ? OFFSET ?'
    );
    return stmt.all(limit, offset) as Event[];
  }

  getEventsWithVenues(limit: number = 50, offset: number = 0): EventWithVenue[] {
    const stmt = this.db.prepare(
      `SELECT e.*, v.name AS venue FROM events e JOIN venues v ON e.venue_id = v.id ORDER BY date DESC LIMIT ? OFFSET ?`
    );
    return stmt.all(limit, offset) as EventWithVenue[];
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

export async function getPastEvents(limit: number = 50, offset: number = 0): Promise<EventWithVenue[]> {
  const model = new EventModel();
  return model.getEventsWithVenues(limit, offset);
}

export async function getEventById(id: string): Promise<EventWithVenue | null> {
  const model = new EventModel();
  return model.getEventWithVenue(Number(id));
}
