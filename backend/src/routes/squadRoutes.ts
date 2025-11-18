import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { createSquad, getSquadById, updateLineup } from '../controllers/squadController';

const router = Router();

/**
 * POST /api/v1/squads
 * Create a new squad
 */
router.post('/', authenticate, createSquad);

/**
 * GET /api/v1/squads/:squadId
 * Get squad details by ID
 */
router.get('/:squadId', authenticate, getSquadById);

/**
 * PUT /api/v1/squads/:squadId/lineup
 * Update squad lineup
 */
router.put('/:squadId/lineup', authenticate, updateLineup);

export default router;
