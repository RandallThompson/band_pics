import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Create database file in the project root
    const dbPath = join(process.cwd(), 'band_pics.db');
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Initialize database schema
    initializeDatabase();
  }
  
  return db;
}

function initializeDatabase(): void {
  if (!db) return;
  
  try {
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'src/lib/database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement);
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});