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
