import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { getMyInventory } from '../controllers/inventoryController';

const router = Router();

/**
 * GET /api/v1/players/my-inventory
 * Get authenticated user's player inventory
 */
router.get('/my-inventory', authenticate, getMyInventory);

export default router;
