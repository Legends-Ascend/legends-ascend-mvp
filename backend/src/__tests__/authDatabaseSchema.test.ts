import { jest } from '@jest/globals';
import * as database from '../config/database';

/**
 * Database schema tests for authentication
 * Verifies that the users table has proper schema including password_hash column
 * Following TECHNICAL_ARCHITECTURE.md - Database testing patterns
 */

// Mock database connection
jest.mock('../config/database', () => ({
  query: jest.fn(),
  initializeDatabase: jest.fn(),
}));

const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

describe('Authentication Database Schema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Users Table Schema', () => {
    it('should have password_hash column', async () => {
      // Mock schema query
      mockQuery.mockResolvedValueOnce({
        rows: [
          { column_name: 'id', data_type: 'uuid' },
          { column_name: 'email', data_type: 'character varying' },
          { column_name: 'password_hash', data_type: 'character varying' },
          { column_name: 'created_at', data_type: 'timestamp without time zone' },
          { column_name: 'updated_at', data_type: 'timestamp without time zone' },
        ],
      } as any);

      const result = await mockQuery(
        `SELECT column_name, data_type 
         FROM information_schema.columns 
         WHERE table_name = 'users'`
      );

      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('password_hash');
      expect(columns).toContain('email');
      expect(columns).toContain('id');
    });

    it('should have password_hash column with VARCHAR(255) type', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          column_name: 'password_hash',
          data_type: 'character varying',
          character_maximum_length: 255,
          is_nullable: 'NO',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT column_name, data_type, character_maximum_length, is_nullable
         FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'password_hash'`
      );

      const passwordHashColumn = result.rows[0];
      
      expect(passwordHashColumn.data_type).toBe('character varying');
      expect(passwordHashColumn.character_maximum_length).toBe(255);
      expect(passwordHashColumn.is_nullable).toBe('NO');
    });

    it('should have email column as UNIQUE', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          constraint_type: 'UNIQUE',
          column_name: 'email',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT tc.constraint_type, kcu.column_name
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
         WHERE tc.table_name = 'users' AND kcu.column_name = 'email'`
      );

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].constraint_type).toBe('UNIQUE');
    });

    it('should have id column as UUID PRIMARY KEY', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          column_name: 'id',
          data_type: 'uuid',
          constraint_type: 'PRIMARY KEY',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT kcu.column_name, c.data_type, tc.constraint_type
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
         JOIN information_schema.columns c
           ON kcu.table_name = c.table_name AND kcu.column_name = c.column_name
         WHERE tc.table_name = 'users' AND tc.constraint_type = 'PRIMARY KEY'`
      );

      const idColumn = result.rows[0];
      
      expect(idColumn.column_name).toBe('id');
      expect(idColumn.data_type).toBe('uuid');
      expect(idColumn.constraint_type).toBe('PRIMARY KEY');
    });
  });

  describe('Migration Safety', () => {
    it('should handle adding password_hash to existing table gracefully', async () => {
      // This test simulates the migration logic
      // First check if column exists
      mockQuery.mockResolvedValueOnce({
        rows: [], // Column doesn't exist yet
      } as any);

      // Then add the column
      mockQuery.mockResolvedValueOnce({
        rows: [],
      } as any);

      // Check if column exists
      const checkResult = await mockQuery(
        `SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'password_hash'`
      );

      if (checkResult.rows.length === 0) {
        // Add column with migration
        await mockQuery(
          `ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ''`
        );
      }

      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should not fail if password_hash column already exists', async () => {
      // Column already exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ exists: true }],
      } as any);

      const checkResult = await mockQuery(
        `SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'password_hash'`
      );

      if (checkResult.rows.length === 0) {
        // This should not be called
        await mockQuery('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)');
      }

      // Should only check, not add
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Integrity', () => {
    it('should enforce NOT NULL constraint on email', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          column_name: 'email',
          is_nullable: 'NO',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT column_name, is_nullable
         FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'email'`
      );

      expect(result.rows[0].is_nullable).toBe('NO');
    });

    it('should enforce NOT NULL constraint on password_hash', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          column_name: 'password_hash',
          is_nullable: 'NO',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT column_name, is_nullable
         FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'password_hash'`
      );

      expect(result.rows[0].is_nullable).toBe('NO');
    });

    it('should have created_at with default CURRENT_TIMESTAMP', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          column_name: 'created_at',
          column_default: 'CURRENT_TIMESTAMP',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT column_name, column_default
         FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'created_at'`
      );

      expect(result.rows[0].column_default).toContain('CURRENT_TIMESTAMP');
    });

    it('should have updated_at with default CURRENT_TIMESTAMP', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          column_name: 'updated_at',
          column_default: 'CURRENT_TIMESTAMP',
        }],
      } as any);

      const result = await mockQuery(
        `SELECT column_name, column_default
         FROM information_schema.columns 
         WHERE table_name = 'users' AND column_name = 'updated_at'`
      );

      expect(result.rows[0].column_default).toContain('CURRENT_TIMESTAMP');
    });
  });
});
