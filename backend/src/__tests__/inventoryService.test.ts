import { InventoryService } from '../services/inventoryService';
import { query } from '../config/database';

// Mock the database query function
jest.mock('../config/database');

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  const mockQuery = query as jest.MockedFunction<typeof query>;

  beforeEach(() => {
    inventoryService = new InventoryService();
    jest.clearAllMocks();
  });

  describe('getUserInventory', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('should retrieve user inventory with default parameters', async () => {
      const mockCountResult = { rows: [{ total: '10' }] };
      const mockInventoryResult = {
        rows: [
          {
            inventory_id: 'inv-1',
            quantity: 1,
            acquired_at: new Date('2025-11-15T10:30:00Z'),
            id: 'player-1',
            name: 'Test Player',
            position: 'FW',
            rarity: 5,
            base_overall: 95,
            tier: 0,
            pace: 90,
            shooting: 92,
            passing: 85,
            dribbling: 88,
            defending: 40,
            physical: 80,
          },
        ],
      };

      mockQuery
        .mockResolvedValueOnce(mockCountResult as any)
        .mockResolvedValueOnce(mockInventoryResult as any);

      const result = await inventoryService.getUserInventory(userId, {
        sort: 'acquired_at',
        order: 'desc',
        page: 1,
        limit: 20,
      });

      expect(result).toEqual({
        inventory: [
          {
            inventory_id: 'inv-1',
            player: {
              id: 'player-1',
              name: 'Test Player',
              position: 'FW',
              rarity: 5,
              base_overall: 95,
              tier: 0,
              pace: 90,
              shooting: 92,
              passing: 85,
              dribbling: 88,
              defending: 40,
              physical: 80,
            },
            quantity: 1,
            acquired_at: '2025-11-15T10:30:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total_items: 10,
          total_pages: 1,
        },
      });

      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should filter by position', async () => {
      const mockCountResult = { rows: [{ total: '5' }] };
      const mockInventoryResult = { rows: [] };

      mockQuery
        .mockResolvedValueOnce(mockCountResult as any)
        .mockResolvedValueOnce(mockInventoryResult as any);

      await inventoryService.getUserInventory(userId, {
        position: 'GK',
        sort: 'acquired_at',
        order: 'desc',
        page: 1,
        limit: 20,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('p.position = $2'),
        expect.arrayContaining([userId, 'GK', 20, 0])
      );
    });

    it('should filter by rarity', async () => {
      const mockCountResult = { rows: [{ total: '3' }] };
      const mockInventoryResult = { rows: [] };

      mockQuery
        .mockResolvedValueOnce(mockCountResult as any)
        .mockResolvedValueOnce(mockInventoryResult as any);

      await inventoryService.getUserInventory(userId, {
        rarity: 5,
        sort: 'acquired_at',
        order: 'desc',
        page: 1,
        limit: 20,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('p.rarity = $2'),
        expect.arrayContaining([userId, 5, 20, 0])
      );
    });

    it('should filter by min and max overall', async () => {
      const mockCountResult = { rows: [{ total: '8' }] };
      const mockInventoryResult = { rows: [] };

      mockQuery
        .mockResolvedValueOnce(mockCountResult as any)
        .mockResolvedValueOnce(mockInventoryResult as any);

      await inventoryService.getUserInventory(userId, {
        min_overall: 80,
        max_overall: 95,
        sort: 'acquired_at',
        order: 'desc',
        page: 1,
        limit: 20,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('p.base_overall >= $2'),
        expect.arrayContaining([userId, 80, 95, 20, 0])
      );
    });

    it('should handle pagination correctly', async () => {
      const mockCountResult = { rows: [{ total: '100' }] };
      const mockInventoryResult = { rows: [] };

      mockQuery
        .mockResolvedValueOnce(mockCountResult as any)
        .mockResolvedValueOnce(mockInventoryResult as any);

      const result = await inventoryService.getUserInventory(userId, {
        sort: 'acquired_at',
        order: 'desc',
        page: 3,
        limit: 10,
      });

      expect(result.pagination).toEqual({
        page: 3,
        limit: 10,
        total_items: 100,
        total_pages: 10,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([userId, 10, 20]) // offset = (3-1) * 10 = 20
      );
    });

    it('should sort by different fields', async () => {
      const mockCountResult = { rows: [{ total: '5' }] };
      const mockInventoryResult = { rows: [] };

      mockQuery
        .mockResolvedValueOnce(mockCountResult as any)
        .mockResolvedValueOnce(mockInventoryResult as any);

      await inventoryService.getUserInventory(userId, {
        sort: 'name',
        order: 'asc',
        page: 1,
        limit: 20,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY p.name ASC'),
        expect.any(Array)
      );
    });
  });

  describe('userOwnsPlayer', () => {
    it('should return true if user owns the player', async () => {
      mockQuery.mockResolvedValue({ rows: [{ exists: true }] } as any);

      const result = await inventoryService.userOwnsPlayer('user-1', 'player-1');

      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM user_inventory WHERE user_id = $1 AND player_id = $2',
        ['user-1', 'player-1']
      );
    });

    it('should return false if user does not own the player', async () => {
      mockQuery.mockResolvedValue({ rows: [] } as any);

      const result = await inventoryService.userOwnsPlayer('user-1', 'player-1');

      expect(result).toBe(false);
    });
  });
});
