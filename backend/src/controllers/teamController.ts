import { Request, Response } from 'express';
import { query } from '../config/database';
import { CreateTeamDTO, TeamLineup } from '../models/Team';

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM teams ORDER BY points DESC, name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM teams WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const team: CreateTeamDTO = req.body;
    
    if (!team.name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const result = await query(
      'INSERT INTO teams (name) VALUES ($1) RETURNING *',
      [team.name]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

export const getTeamLineup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT tl.id, tl.team_id, tl.player_id, tl.position_in_lineup,
              p.name, p.position, p.overall_rating, p.pace, p.shooting, 
              p.passing, p.dribbling, p.defending, p.physical
       FROM team_lineups tl
       JOIN players p ON tl.player_id = p.id
       WHERE tl.team_id = $1
       ORDER BY tl.position_in_lineup`,
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team lineup:', error);
    res.status(500).json({ error: 'Failed to fetch team lineup' });
  }
};

export const addPlayerToLineup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { player_id, position_in_lineup }: Partial<TeamLineup> = req.body;
    
    if (!player_id || !position_in_lineup) {
      return res.status(400).json({ error: 'Player ID and position are required' });
    }

    // Check if player exists
    const playerCheck = await query('SELECT id FROM players WHERE id = $1', [player_id]);
    if (playerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if team exists
    const teamCheck = await query('SELECT id FROM teams WHERE id = $1', [id]);
    if (teamCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const result = await query(
      `INSERT INTO team_lineups (team_id, player_id, position_in_lineup)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, player_id, position_in_lineup]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error adding player to lineup:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Player already in lineup' });
    }
    res.status(500).json({ error: 'Failed to add player to lineup' });
  }
};

export const removePlayerFromLineup = async (req: Request, res: Response) => {
  try {
    const { id, playerId } = req.params;
    
    const result = await query(
      'DELETE FROM team_lineups WHERE team_id = $1 AND player_id = $2 RETURNING *',
      [id, playerId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not in lineup' });
    }
    
    res.json({ message: 'Player removed from lineup' });
  } catch (error) {
    console.error('Error removing player from lineup:', error);
    res.status(500).json({ error: 'Failed to remove player from lineup' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        points,
        wins,
        draws,
        losses,
        goals_for,
        goals_against,
        (goals_for - goals_against) as goal_difference,
        (wins + draws + losses) as matches_played
      FROM teams
      ORDER BY points DESC, goal_difference DESC, goals_for DESC, name ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
