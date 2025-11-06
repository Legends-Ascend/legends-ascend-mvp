import { Router } from 'express';
import {
  createMatch,
  simulateMatchAsync,
  getMatchById,
  getAllMatches,
} from '../controllers/matchController';

const router = Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', createMatch);
router.post('/:id/simulate', simulateMatchAsync);

export default router;
