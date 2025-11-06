import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  getTeamLineup,
  addPlayerToLineup,
  removePlayerFromLineup,
  getLeaderboard,
} from '../controllers/teamController';

const router = Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', createTeam);
router.get('/:id/lineup', getTeamLineup);
router.post('/:id/lineup', addPlayerToLineup);
router.delete('/:id/lineup/:playerId', removePlayerFromLineup);
router.get('/leaderboard/all', getLeaderboard);

export default router;
