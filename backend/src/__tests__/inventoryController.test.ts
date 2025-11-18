import { Request, Response } from 'express';
import { getMyInventory } from '../controllers/inventoryController';
import { InventoryService } from '../services/inventoryService';
import { AuthenticatedRequest } from '../middleware/authenticate';

// Mock the InventoryService
jest.mock('../services/inventoryService');

describe('InventoryController', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    req = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      query: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('GET /api/v1/players/my-inventory', () => {
    it('should return 200 with valid inventory data', async () => {
      const mockInventory = {
        inventory: [
          {
            inventory_id: 'inv-1',
            player: {
              id: 'player-1',
              name: 'Test Player',
              position: 'FW' as const,
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
            acquired_at: '2025-11-15T10:30:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total_items: 1,
          total_pages: 1,
        },
      };

      InventoryService.prototype.getUserInventory = jest.fn().mockResolvedValue(mockInventory);

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockInventory,
      });
    });

    it('should return 500 on database error', async () => {
      InventoryService.prototype.getUserInventory = jest.fn().mockRejectedValue(new Error('DB error'));

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'An error occurred while fetching inventory',
        },
      });
    });

    it('should return 400 for invalid position parameter', async () => {
      req.query = { position: 'INVALID' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INVALID_INPUT',
            message: 'Invalid query parameters',
          }),
        })
      );
    });

    it('should return 400 for invalid rarity parameter', async () => {
      req.query = { rarity: '6' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INVALID_INPUT',
          }),
        })
      );
    });

    it('should return 400 for rarity out of range (below 1)', async () => {
      req.query = { rarity: '0' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for min_overall out of range', async () => {
      req.query = { min_overall: '39' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for max_overall out of range', async () => {
      req.query = { max_overall: '100' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid sort parameter', async () => {
      req.query = { sort: 'invalid_field' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid order parameter', async () => {
      req.query = { order: 'invalid' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for page less than 1', async () => {
      req.query = { page: '0' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for limit exceeding 100', async () => {
      req.query = { limit: '101' };

      await getMyInventory(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});
