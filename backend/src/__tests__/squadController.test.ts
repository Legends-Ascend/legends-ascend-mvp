import { Request, Response } from 'express';
import { createSquad, getSquadById, updateLineup } from '../controllers/squadController';
import { SquadService } from '../services/squadService';
import { InventoryService } from '../services/inventoryService';
import { AuthenticatedRequest } from '../middleware/authenticate';

// Mock the services
jest.mock('../services/squadService');
jest.mock('../services/inventoryService');

describe('SquadController', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    req = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      body: {},
      params: {},
      query: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('POST /api/v1/squads', () => {
    it('should create squad successfully with valid data', async () => {
      req.body = {
        name: 'Main Squad',
        formation: '4-3-3',
        is_active: true,
      };

      const mockSquad = {
        id: 'squad-id',
        user_id: req.user_id,
        name: 'Main Squad',
        formation: '4-3-3',
        is_active: true,
        created_at: '2025-11-18T12:00:00Z',
        updated_at: '2025-11-18T12:00:00Z',
        positions: [],
      };

      SquadService.prototype.createSquad = jest.fn().mockResolvedValue(mockSquad);

      await createSquad(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { squad: mockSquad },
        message: 'Squad created successfully',
      });
    });

    it('should return 409 when squad name exists', async () => {
      req.body = {
        name: 'Existing Squad',
        formation: '4-3-3',
      };

      SquadService.prototype.createSquad = jest.fn().mockRejectedValue(new Error('SQUAD_NAME_EXISTS'));

      await createSquad(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'SQUAD_NAME_EXISTS',
          message: 'A squad with this name already exists',
        },
      });
    });

    it('should return 500 on database error', async () => {
      req.body = {
        name: 'Test Squad',
        formation: '4-3-3',
      };

      SquadService.prototype.createSquad = jest.fn().mockRejectedValue(new Error('DB error'));

      await createSquad(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });

    it('should return 400 for invalid formation', async () => {
      req.body = {
        name: 'Main Squad',
        formation: '3-4-3', // Invalid formation
      };

      await createSquad(req as AuthenticatedRequest, res as Response);

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

    it('should return 400 for missing name', async () => {
      req.body = {
        formation: '4-3-3',
      };

      await createSquad(req as AuthenticatedRequest, res as Response);

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

    it('should return 400 for empty name', async () => {
      req.body = {
        name: '',
        formation: '4-3-3',
      };

      await createSquad(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for name exceeding 100 characters', async () => {
      req.body = {
        name: 'A'.repeat(101),
        formation: '4-3-3',
      };

      await createSquad(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should accept valid formations', async () => {
      const validFormations = ['4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2'];
      
      for (const formation of validFormations) {
        jest.clearAllMocks();
        
        req.body = {
          name: `Squad ${formation}`,
          formation,
        };

        SquadService.prototype.createSquad = jest.fn().mockResolvedValue({
          id: 'test-id',
          user_id: req.user_id,
          name: req.body.name,
          formation,
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          positions: [],
        });

        await createSquad(req as AuthenticatedRequest, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
      }
    });
  });

  describe('GET /api/v1/squads/:squadId', () => {
    it('should return squad details successfully', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };

      const mockSquad = {
        id: req.params.squadId,
        user_id: req.user_id,
        name: 'Test Squad',
        formation: '4-3-3',
        is_active: true,
        created_at: '2025-11-18T12:00:00Z',
        updated_at: '2025-11-18T12:00:00Z',
        positions: [],
        starters_count: 11,
        bench_count: 7,
        filled_positions: 0,
        empty_positions: 18,
      };

      SquadService.prototype.getSquadById = jest.fn().mockResolvedValue(mockSquad);

      await getSquadById(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { squad: mockSquad },
      });
    });

    it('should return 404 if squad not found', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };

      SquadService.prototype.getSquadById = jest.fn().mockRejectedValue(new Error('SQUAD_NOT_FOUND'));

      await getSquadById(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user does not own squad', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };

      SquadService.prototype.getSquadById = jest.fn().mockRejectedValue(new Error('FORBIDDEN'));

      await getSquadById(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
    });

    it('should return 500 on database error', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };

      SquadService.prototype.getSquadById = jest.fn().mockRejectedValue(new Error('DB error'));

      await getSquadById(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });

    it('should return 400 for invalid squad ID format', async () => {
      req.params = { squadId: 'invalid-uuid' };

      await getSquadById(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid squad ID format',
        },
      });
    });

    it('should return 400 for non-UUID strings', async () => {
      req.params = { squadId: 'not-a-uuid-at-all' };

      await getSquadById(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });

  describe('PUT /api/v1/squads/:squadId/lineup', () => {
    it('should update lineup successfully', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [
          {
            position_slot: 'GK_1',
            player_id: '123e4567-e89b-12d3-a456-426614174020',
          },
        ],
      };

      const mockSquad = {
        id: req.params.squadId,
        user_id: req.user_id,
        name: 'Test Squad',
        formation: '4-3-3',
        is_active: true,
        created_at: '2025-11-18T12:00:00Z',
        updated_at: '2025-11-18T13:00:00Z',
        positions: [],
        starters_count: 11,
        bench_count: 7,
        filled_positions: 1,
        empty_positions: 17,
      };

      SquadService.prototype.updateLineup = jest.fn().mockResolvedValue(mockSquad);

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { squad: mockSquad },
        message: 'Lineup updated successfully',
      });
    });

    it('should return 404 if squad not found', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      SquadService.prototype.updateLineup = jest.fn().mockRejectedValue(new Error('SQUAD_NOT_FOUND'));

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user does not own squad', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      SquadService.prototype.updateLineup = jest.fn().mockRejectedValue(new Error('FORBIDDEN'));

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
    });

    it('should return 400 if player not found', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      SquadService.prototype.updateLineup = jest.fn().mockRejectedValue(new Error('PLAYER_NOT_FOUND'));

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('should return 409 for duplicate assignment', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [
          { position_slot: 'MF_1', player_id: 'player-1' },
          { position_slot: 'MF_2', player_id: 'player-1' },
        ],
      };

      SquadService.prototype.updateLineup = jest.fn().mockRejectedValue(new Error('DUPLICATE_ASSIGNMENT'));

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
    });

    it('should return 500 on database error', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [{ position_slot: 'GK_1', player_id: 'player-1' }],
      };

      SquadService.prototype.updateLineup = jest.fn().mockRejectedValue(new Error('DB error'));

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });

    it('should return 400 for invalid squad ID', async () => {
      req.params = { squadId: 'invalid-uuid' };
      req.body = { positions: [] };

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid squad ID format',
        },
      });
    });

    it('should return 400 for missing positions array', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {};

      await updateLineup(req as AuthenticatedRequest, res as Response);

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

    it('should return 400 for empty positions array', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = { positions: [] };

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid player_id format', async () => {
      req.params = { squadId: '123e4567-e89b-12d3-a456-426614174010' };
      req.body = {
        positions: [
          {
            position_slot: 'GK_1',
            player_id: 'not-a-uuid',
          },
        ],
      };

      await updateLineup(req as AuthenticatedRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});
