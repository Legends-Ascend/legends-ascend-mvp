import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { SquadService } from '../services/squadService';
import { InventoryService } from '../services/inventoryService';
import { CreateSquadSchema, UpdateLineupSchema } from '../models/Squad';

const squadService = new SquadService();
const inventoryService = new InventoryService();

/**
 * POST /api/v1/squads
 * Create a new squad for the authenticated user
 */
export const createSquad = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user_id!;

    // Validate request body
    const validationResult = CreateSquadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid squad data',
          details: validationResult.error.issues,
        },
      });
    }

    const squad = await squadService.createSquad(userId, validationResult.data);

    return res.status(201).json({
      success: true,
      data: { squad },
      message: 'Squad created successfully',
    });
  } catch (error: any) {
    console.error('Error creating squad:', error);

    if (error.message === 'SQUAD_NAME_EXISTS') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'SQUAD_NAME_EXISTS',
          message: 'A squad with this name already exists',
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'An error occurred while creating squad',
      },
    });
  }
};

/**
 * GET /api/v1/squads/:squadId
 * Get squad details by ID
 */
export const getSquadById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user_id!;
    const squadId = req.params.squadId;
    const includeStats = req.query.include_stats === 'true';

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(squadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid squad ID format',
        },
      });
    }

    const squad = await squadService.getSquadById(squadId, userId, includeStats);

    return res.status(200).json({
      success: true,
      data: { squad },
    });
  } catch (error: any) {
    console.error('Error fetching squad:', error);

    if (error.message === 'SQUAD_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Squad not found',
        },
      });
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this squad',
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'An error occurred while fetching squad',
      },
    });
  }
};

/**
 * PUT /api/v1/squads/:squadId/lineup
 * Update squad lineup
 */
export const updateLineup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user_id!;
    const squadId = req.params.squadId;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(squadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid squad ID format',
        },
      });
    }

    // Validate request body
    const validationResult = UpdateLineupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid lineup data',
          details: validationResult.error.issues,
        },
      });
    }

    const squad = await squadService.updateLineup(
      squadId,
      userId,
      validationResult.data,
      inventoryService.userOwnsPlayer.bind(inventoryService)
    );

    return res.status(200).json({
      success: true,
      data: { squad },
      message: 'Lineup updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating lineup:', error);

    if (error.message === 'SQUAD_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Squad not found',
        },
      });
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to modify this squad',
        },
      });
    }

    if (error.message === 'PLAYER_NOT_IN_INVENTORY') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PLAYER_NOT_IN_INVENTORY',
          message: 'Player not found in your inventory',
        },
      });
    }

    if (error.message === 'PLAYER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Player not found',
        },
      });
    }

    if (error.message === 'POSITION_MISMATCH') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'POSITION_MISMATCH',
          message: 'Player position is not compatible with the slot',
        },
      });
    }

    if (error.message === 'DUPLICATE_ASSIGNMENT') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ASSIGNMENT',
          message: 'Player is already assigned to another position in this squad',
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'An error occurred while updating lineup',
      },
    });
  }
};
