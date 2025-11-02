import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    await query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(50) NOT NULL,
        overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 100),
        pace INTEGER NOT NULL CHECK (pace >= 1 AND pace <= 100),
        shooting INTEGER NOT NULL CHECK (shooting >= 1 AND shooting <= 100),
        passing INTEGER NOT NULL CHECK (passing >= 1 AND passing <= 100),
        dribbling INTEGER NOT NULL CHECK (dribbling >= 1 AND dribbling <= 100),
        defending INTEGER NOT NULL CHECK (defending >= 1 AND defending <= 100),
        physical INTEGER NOT NULL CHECK (physical >= 1 AND physical <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        points INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        goals_for INTEGER DEFAULT 0,
        goals_against INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS team_lineups (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        position_in_lineup VARCHAR(50) NOT NULL,
        UNIQUE(team_id, player_id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        home_score INTEGER DEFAULT 0,
        away_score INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;
