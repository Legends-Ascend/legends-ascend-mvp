import { SquadService } from '../services/squadService';
import { query } from '../config/database';

// Mock the database query function
jest.mock('../config/database');

describe('SquadService', () => {
  let squadService: SquadService;
  const mockQuery = query as jest.MockedFunction<typeof query>;
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const squadId = '123e4567-e89b-12d3-a456-426614174010';

  beforeEach(() => {
    squadService = new SquadService();
    jest.clearAllMocks();
  });

  describe('createSquad', () => {
    it('should create a new squad successfully', async () => {
      const squadData = {
        name: 'Main Squad',
        formation: '4-3-3' as const,
        is_active: true,
      };

      // Mock: check for existing squad name
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: deactivate other squads
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: create squad
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: squadId,
            user_id: userId,
            name: 'Main Squad',
            formation: '4-3-3',
            is_active: true,
            created_at: new Date('2025-11-18T12:00:00Z'),
            updated_at: new Date('2025-11-18T12:00:00Z'),
          },
        ],
      } as any);

      // Mock: insert squad positions (18 times)
      for (let i = 0; i < 18; i++) {
        mockQuery.mockResolvedValueOnce({
          rows: [
            {
              id: `pos-${i}`,
              squad_id: squadId,
              player_id: null,
              position_slot: `SLOT_${i}`,
              slot_type: i < 11 ? 'STARTER' : 'BENCH',
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
        } as any);
      }

      const result = await squadService.createSquad(userId, squadData);

      expect(result.id).toBe(squadId);
      expect(result.name).toBe('Main Squad');
      expect(result.formation).toBe('4-3-3');
      expect(result.positions).toHaveLength(18);
    });

    it('should throw error if squad name already exists', async () => {
      const squadData = {
        name: 'Existing Squad',
        formation: '4-3-3' as const,
        is_active: false,
      };

      // Mock: squad name exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-squad-id' }],
      } as any);

      await expect(squadService.createSquad(userId, squadData)).rejects.toThrow(
        'SQUAD_NAME_EXISTS'
      );
    });

    it('should deactivate other squads when is_active is true', async () => {
      const squadData = {
        name: 'New Active Squad',
        formation: '4-4-2' as const,
        is_active: true,
      };

      mockQuery.mockResolvedValueOnce({ rows: [] } as any); // No existing squad
      mockQuery.mockResolvedValueOnce({ rows: [] } as any); // Deactivate call
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: squadId,
            user_id: userId,
            name: squadData.name,
            formation: squadData.formation,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      } as any);

      // Mock position inserts
      for (let i = 0; i < 18; i++) {
        mockQuery.mockResolvedValueOnce({ rows: [{}] } as any);
      }

      await squadService.createSquad(userId, squadData);

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE squads SET is_active = false WHERE user_id = $1',
        [userId]
      );
    });
  });

  describe('getSquadById', () => {
    it('should retrieve squad details', async () => {
      // Mock: get squad
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: squadId,
            user_id: userId,
            name: 'Test Squad',
            formation: '4-3-3',
            is_active: true,
            created_at: new Date('2025-11-18T12:00:00Z'),
            updated_at: new Date('2025-11-18T12:00:00Z'),
          },
        ],
      } as any);

      // Mock: get squad positions
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'pos-1',
            position_slot: 'GK_1',
            slot_type: 'STARTER',
            player_id: 'player-1',
            name: 'Test Player',
            position: 'GK',
            rarity: 4,
            base_overall: 85,
            tier: 1,
            pace: 60,
            shooting: 50,
            passing: 70,
            dribbling: 65,
            defending: 45,
            physical: 80,
          },
        ],
      } as any);

      const result = await squadService.getSquadById(squadId, userId, true);

      expect(result.id).toBe(squadId);
      expect(result.positions).toHaveLength(1);
      expect(result.positions[0].player).toBeDefined();
      expect(result.positions[0].player?.name).toBe('Test Player');
    });

    it('should throw error if squad not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await expect(squadService.getSquadById(squadId, userId)).rejects.toThrow(
        'SQUAD_NOT_FOUND'
      );
    });

    it('should throw error if user does not own squad', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: squadId,
            user_id: 'other-user-id',
            name: 'Other Squad',
            formation: '4-3-3',
            is_active: false,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      } as any);

      await expect(squadService.getSquadById(squadId, userId)).rejects.toThrow('FORBIDDEN');
    });

    it('should exclude player stats when include_stats is false', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: squadId,
            user_id: userId,
            name: 'Test Squad',
            formation: '4-3-3',
            is_active: false,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      } as any);

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'pos-1',
            position_slot: 'GK_1',
            slot_type: 'STARTER',
            player_id: 'player-1',
            name: 'Test Player',
            position: 'GK',
            rarity: 4,
            base_overall: 85,
            tier: 1,
            pace: 60,
            shooting: 50,
            passing: 70,
            dribbling: 65,
            defending: 45,
            physical: 80,
          },
        ],
      } as any);

      const result = await squadService.getSquadById(squadId, userId, false);

      expect(result.positions[0].player).toBeDefined();
      expect(result.positions[0].player).not.toHaveProperty('pace');
    });
  });

  describe('updateLineup', () => {
    const mockUserOwnsPlayer = jest.fn();

    it('should update lineup successfully', async () => {
      const lineupData = {
        positions: [
          {
            position_slot: 'GK_1',
            player_id: 'player-gk',
          },
        ],
      };

      // Mock: verify squad exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: userId }],
      } as any);

      // Mock: check ownership
      mockUserOwnsPlayer.mockResolvedValue(true);

      // Mock: get player position
      mockQuery.mockResolvedValueOnce({
        rows: [{ position: 'GK' }],
      } as any);

      // Mock: get current assignments
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: update position
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: update squad timestamp
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: getSquadById for return value
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: squadId,
            user_id: userId,
            name: 'Test Squad',
            formation: '4-3-3',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      } as any);
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await squadService.updateLineup(squadId, userId, lineupData, mockUserOwnsPlayer);

      expect(mockUserOwnsPlayer).toHaveBeenCalledWith(userId, 'player-gk');
    });

    it('should throw error if squad not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const lineupData = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      await expect(
        squadService.updateLineup(squadId, userId, lineupData, mockUserOwnsPlayer)
      ).rejects.toThrow('SQUAD_NOT_FOUND');
    });

    it('should throw error if user does not own squad', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: 'other-user' }],
      } as any);

      const lineupData = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      await expect(
        squadService.updateLineup(squadId, userId, lineupData, mockUserOwnsPlayer)
      ).rejects.toThrow('FORBIDDEN');
    });

    it('should throw error if player not in inventory', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: userId }],
      } as any);

      mockUserOwnsPlayer.mockResolvedValue(false);

      const lineupData = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      await expect(
        squadService.updateLineup(squadId, userId, lineupData, mockUserOwnsPlayer)
      ).rejects.toThrow('PLAYER_NOT_IN_INVENTORY');
    });

    it('should throw error for position mismatch', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: userId }],
      } as any);

      mockUserOwnsPlayer.mockResolvedValue(true);

      mockQuery.mockResolvedValueOnce({
        rows: [{ position: 'FW' }],
      } as any);

      const lineupData = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-fw' }],
      };

      await expect(
        squadService.updateLineup(squadId, userId, lineupData, mockUserOwnsPlayer)
      ).rejects.toThrow('POSITION_MISMATCH');
    });

    it('should throw error for duplicate assignment', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: userId }],
      } as any);

      const lineupData = {
        positions: [
          { position_slot: 'MF_1', player_id: 'player-mf' },
          { position_slot: 'MF_2', player_id: 'player-mf' },
        ],
      };

      await expect(
        squadService.updateLineup(squadId, userId, lineupData, mockUserOwnsPlayer)
      ).rejects.toThrow('DUPLICATE_ASSIGNMENT');
    });
  });
});
