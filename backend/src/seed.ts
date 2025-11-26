import bcrypt from 'bcrypt';
import { query } from './config/database';

/**
 * Database Seed Script
 * Following TECHNICAL_ARCHITECTURE.md
 * Implements US-051 admin account creation
 */

/**
 * Admin credentials as specified in US-051 requirements.
 * NOTE: Per US-051 specification, admin credentials are defined in the seed script
 * rather than environment variables to ensure consistent deployment. This is the
 * designated location for MVP admin account setup. In production, consider migrating
 * to a more secure configuration management approach.
 */
const ADMIN_USERNAME = 'supersaiyan';
const ADMIN_PASSWORD = 'wh4t15myd35t1ny!';
const SALT_ROUNDS = 10;

const samplePlayers = [
  // Forwards
  { name: 'Marco Silva', position: 'ST', overall_rating: 87, pace: 90, shooting: 92, passing: 75, dribbling: 88, defending: 35, physical: 78 },
  { name: 'Diego Martinez', position: 'ST', overall_rating: 85, pace: 88, shooting: 90, passing: 72, dribbling: 85, defending: 30, physical: 82 },
  { name: 'Lucas Santos', position: 'LW', overall_rating: 86, pace: 93, shooting: 80, passing: 82, dribbling: 91, defending: 38, physical: 65 },
  { name: 'Rafael Costa', position: 'RW', overall_rating: 84, pace: 91, shooting: 79, passing: 80, dribbling: 89, defending: 35, physical: 68 },
  
  // Midfielders
  { name: 'Carlos Rodriguez', position: 'CM', overall_rating: 86, pace: 70, shooting: 78, passing: 90, dribbling: 83, defending: 72, physical: 75 },
  { name: 'Miguel Fernandez', position: 'CM', overall_rating: 85, pace: 72, shooting: 75, passing: 88, dribbling: 82, defending: 75, physical: 78 },
  { name: 'Andre Oliveira', position: 'LM', overall_rating: 83, pace: 85, shooting: 72, passing: 84, dribbling: 87, defending: 55, physical: 68 },
  { name: 'Bruno Alves', position: 'RM', overall_rating: 82, pace: 84, shooting: 71, passing: 83, dribbling: 86, defending: 58, physical: 70 },
  
  // Defenders
  { name: 'Antonio Garcia', position: 'CB', overall_rating: 85, pace: 68, shooting: 45, passing: 70, dribbling: 65, defending: 90, physical: 88 },
  { name: 'Paulo Sousa', position: 'CB', overall_rating: 84, pace: 65, shooting: 42, passing: 68, dribbling: 62, defending: 89, physical: 90 },
  { name: 'Luis Pereira', position: 'LB', overall_rating: 82, pace: 82, shooting: 55, passing: 75, dribbling: 76, defending: 84, physical: 78 },
  { name: 'Roberto Lima', position: 'RB', overall_rating: 81, pace: 80, shooting: 52, passing: 73, dribbling: 74, defending: 83, physical: 80 },
  
  // Goalkeeper
  { name: 'Gabriel Mendes', position: 'GK', overall_rating: 88, pace: 45, shooting: 30, passing: 55, dribbling: 40, defending: 50, physical: 70 },
];

/**
 * Create admin account if it doesn't exist
 * Per US-051 FR-1, FR-2, FR-3
 */
export async function seedAdminAccount(): Promise<void> {
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
    console.error('Error seeding admin account:', error);
    throw error;
  }
}

export const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Seed admin account first (US-051)
    await seedAdminAccount();

    // Insert sample players
    for (const player of samplePlayers) {
      await query(
        `INSERT INTO players (name, position, overall_rating, pace, shooting, passing, dribbling, defending, physical)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          player.name,
          player.position,
          player.overall_rating,
          player.pace,
          player.shooting,
          player.passing,
          player.dribbling,
          player.defending,
          player.physical,
        ]
      );
    }
    console.log(`✓ Seeded ${samplePlayers.length} players`);

    // Create sample teams
    const teams = [
      'FC Barcelona',
      'Real Madrid',
      'Manchester United',
      'Bayern Munich',
      'Paris Saint-Germain',
      'Liverpool FC',
    ];

    for (const teamName of teams) {
      await query('INSERT INTO teams (name) VALUES ($1)', [teamName]);
    }
    console.log(`✓ Seeded ${teams.length} teams`);

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  const { initializeDatabase } = require('./config/database');
  
  initializeDatabase()
    .then(() => seedDatabase())
    .then(() => {
      console.log('All done!');
      process.exit(0);
    })
    .catch((error: any) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
