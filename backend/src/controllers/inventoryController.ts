import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { InventoryService } from '../services/inventoryService';
import { InventoryQuerySchema } from '../models/UserInventory';

const inventoryService = new InventoryService();

/**
 * GET /api/v1/players/my-inventory
 * Get authenticated user's player inventory with filtering and pagination
 */
export const getMyInventory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user_id!;

    // Parse and validate query parameters
    const queryParams = {
      position: req.query.position as string | undefined,
      rarity: req.query.rarity ? parseInt(req.query.rarity as string) : undefined,
      min_overall: req.query.min_overall ? parseInt(req.query.min_overall as string) : undefined,
      max_overall: req.query.max_overall ? parseInt(req.query.max_overall as string) : undefined,
      sort: (req.query.sort as string) || 'acquired_at',
      order: (req.query.order as string) || 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    // Validate query parameters
    const validationResult = InventoryQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid query parameters',
          details: validationResult.error.issues,
        },
      });
    }

    const result = await inventoryService.getUserInventory(userId, validationResult.data);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching user inventory:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'An error occurred while fetching inventory',
      },
    });
  }
};
