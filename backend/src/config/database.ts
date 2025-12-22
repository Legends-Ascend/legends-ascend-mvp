import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { ADMIN_USERNAME, ADMIN_PASSWORD, SALT_ROUNDS } from './adminConstants';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.LA_POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initializeDatabase = async () => {
  try {
    // Enable UUID extension
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table (prerequisite for foreign keys)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add password_hash column if it doesn't exist (migration for existing tables)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'password_hash'
        ) THEN
          ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';
        END IF;
      END $$;
    `);

    // Add newsletter opt-in fields for US-048
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'newsletter_optin'
        ) THEN
          ALTER TABLE users ADD COLUMN newsletter_optin BOOLEAN DEFAULT false NOT NULL;
        END IF;
      END $$;
    `);

    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'newsletter_consent_timestamp'
        ) THEN
          ALTER TABLE users ADD COLUMN newsletter_consent_timestamp TIMESTAMP NULL;
        END IF;
      END $$;
    `);

    // Create index for newsletter preferences
    await query(`CREATE INDEX IF NOT EXISTS idx_users_newsletter_optin ON users(newsletter_optin)`);

    // Add role column for US-051 (Admin Account)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'role'
        ) THEN
          ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' NOT NULL;
        END IF;
      END $$;
    `);

    // Add username column for US-051 (Admin Account)
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'username'
        ) THEN
          ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE NULL;
        END IF;
      END $$;
    `);

    // Create index for username lookups
    await query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL`);

    // Create players table (US-044)
    await query(`
      CREATE TABLE IF NOT EXISTS players (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        position VARCHAR(10) NOT NULL CHECK (position IN ('GK', 'DF', 'MF', 'FW', 'UT')),
        rarity INTEGER NOT NULL CHECK (rarity >= 1 AND rarity <= 5),
        base_overall INTEGER NOT NULL CHECK (base_overall >= 40 AND base_overall <= 99),
        tier INTEGER DEFAULT 0 CHECK (tier >= 0 AND tier <= 5),
        pace INTEGER NOT NULL CHECK (pace >= 1 AND pace <= 100),
        shooting INTEGER NOT NULL CHECK (shooting >= 1 AND shooting <= 100),
        passing INTEGER NOT NULL CHECK (passing >= 1 AND passing <= 100),
        dribbling INTEGER NOT NULL CHECK (dribbling >= 1 AND dribbling <= 100),
        defending INTEGER NOT NULL CHECK (defending >= 1 AND defending <= 100),
        physical INTEGER NOT NULL CHECK (physical >= 1 AND physical <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for players table
    await query(`CREATE INDEX IF NOT EXISTS idx_players_position ON players(position)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_players_rarity ON players(rarity)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_players_base_overall ON players(base_overall)`);

    // Create user_inventory table (US-044)
    await query(`
      CREATE TABLE IF NOT EXISTS user_inventory (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 50),
        acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, player_id)
      )
    `);

    // Create indexes for user_inventory table
    await query(`CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_user_inventory_user_player ON user_inventory(user_id, player_id)`);

    // Create squads table (US-044)
    await query(`
      CREATE TABLE IF NOT EXISTS squads (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        formation VARCHAR(10) NOT NULL CHECK (formation IN ('4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2')),
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for squads table
    await query(`CREATE INDEX IF NOT EXISTS idx_squads_user_id ON squads(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_squads_user_active ON squads(user_id, is_active)`);

    // Create squad_positions table (US-044)
    await query(`
      CREATE TABLE IF NOT EXISTS squad_positions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
        player_id UUID REFERENCES players(id) ON DELETE SET NULL,
        position_slot VARCHAR(20) NOT NULL,
        slot_type VARCHAR(10) NOT NULL CHECK (slot_type IN ('STARTER', 'BENCH')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(squad_id, position_slot)
      )
    `);

    // Create unique constraint for player assignment (excluding NULL player_id)
    await query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_squad_positions_unique_player 
      ON squad_positions(squad_id, player_id) 
      WHERE player_id IS NOT NULL
    `);

    // Create indexes for squad_positions table
    await query(`CREATE INDEX IF NOT EXISTS idx_squad_positions_squad_id ON squad_positions(squad_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_squad_positions_player_id ON squad_positions(player_id)`);

    // Legacy tables for backward compatibility
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
        player_id UUID REFERENCES players(id) ON DELETE CASCADE,
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

    // Seed admin account after database initialization (US-051)
    await seedAdminAccount();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Seed admin account if it doesn't exist
 * Per US-051 FR-1, FR-2, FR-3
 * Called automatically during database initialization
 */
async function seedAdminAccount(): Promise<void> {
  try {
    // Check if admin already exists
    const existing = await query(
      'SELECT id FROM users WHERE username = $1',
      [ADMIN_USERNAME]
    );

    if (existing.rows.length > 0) {
      console.log('Admin account already exists, skipping seed');
      return;
    }

    // Hash password with bcrypt (10 salt rounds per security requirements)
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // Create admin account with role 'admin'
    // Admin has a special internal email that cannot be used for login
    await query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, 'admin')`,
      [ADMIN_USERNAME, `${ADMIN_USERNAME}@admin.legendsascend.local`, passwordHash]
    );

    console.log('Admin account created successfully');
  } catch (error) {
    // Log detailed error but don't throw to prevent deployment failures
    // Admin account can be manually created later if automatic seeding fails
    console.error('ERROR: Failed to seed admin account during database initialization');
    console.error('Error details:', error);
    console.warn('WARNING: Admin account may need to be created manually');
    console.warn(`Run: npm run seed -- or manually create user with username="${ADMIN_USERNAME}"`);
    // Don't throw - allow app to continue even if admin seed fails
  }
}

export default pool;
