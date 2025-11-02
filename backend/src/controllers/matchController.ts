import { Request, Response } from 'express';
import { query } from '../config/database';

// Simple match simulator that calculates scores based on team strength
const simulateMatch = async (homeTeamId: number, awayTeamId: number) => {
  // Get home team lineup
  const homeLineup = await query(
    `SELECT p.overall_rating, p.shooting, p.defending
     FROM team_lineups tl
     JOIN players p ON tl.player_id = p.id
     WHERE tl.team_id = $1`,
    [homeTeamId]
  );

  // Get away team lineup
  const awayLineup = await query(
    `SELECT p.overall_rating, p.shooting, p.defending
     FROM team_lineups tl
     JOIN players p ON tl.player_id = p.id
     WHERE tl.team_id = $1`,
    [awayTeamId]
  );

  if (homeLineup.rows.length === 0 || awayLineup.rows.length === 0) {
    throw new Error('One or both teams do not have a lineup');
  }

  // Calculate team strengths
  const homeStrength = homeLineup.rows.reduce((sum: number, player: any) => 
    sum + (player.overall_rating + player.shooting) / 2, 0
  ) / homeLineup.rows.length;

  const awayStrength = awayLineup.rows.reduce((sum: number, player: any) => 
    sum + (player.overall_rating + player.shooting) / 2, 0
  ) / awayLineup.rows.length;

  const homeDefense = homeLineup.rows.reduce((sum: number, player: any) => 
    sum + player.defending, 0
  ) / homeLineup.rows.length;

  const awayDefense = awayLineup.rows.reduce((sum: number, player: any) => 
    sum + player.defending, 0
  ) / awayLineup.rows.length;

  // Calculate scores with some randomness (home advantage included)
  const homeAttackPower = homeStrength * (0.8 + Math.random() * 0.4) * 1.1; // 10% home advantage
  const awayAttackPower = awayStrength * (0.8 + Math.random() * 0.4);

  // Goals depend on attack power vs defense
  const homeScore = Math.max(0, Math.floor((homeAttackPower - awayDefense / 20) / 15));
  const awayScore = Math.max(0, Math.floor((awayAttackPower - homeDefense / 20) / 15));

  return { homeScore, awayScore };
};

export const createMatch = async (req: Request, res: Response) => {
  try {
    const { home_team_id, away_team_id } = req.body;

    if (!home_team_id || !away_team_id) {
      return res.status(400).json({ error: 'Both team IDs are required' });
    }

    if (home_team_id === away_team_id) {
      return res.status(400).json({ error: 'A team cannot play against itself' });
    }

    // Check if teams exist
    const homeTeam = await query('SELECT id, name FROM teams WHERE id = $1', [home_team_id]);
    const awayTeam = await query('SELECT id, name FROM teams WHERE id = $1', [away_team_id]);

    if (homeTeam.rows.length === 0 || awayTeam.rows.length === 0) {
      return res.status(404).json({ error: 'One or both teams not found' });
    }

    const result = await query(
      `INSERT INTO matches (home_team_id, away_team_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [home_team_id, away_team_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
};

export const simulateMatchAsync = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get match details
    const matchResult = await query(
      `SELECT m.*, ht.name as home_team_name, at.name as away_team_name
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.id
       JOIN teams at ON m.away_team_id = at.id
       WHERE m.id = $1`,
      [id]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];

    if (match.status === 'completed') {
      return res.status(400).json({ error: 'Match already completed' });
    }

    // Update match status to in_progress
    await query(
      "UPDATE matches SET status = 'in_progress' WHERE id = $1",
      [id]
    );

    // Simulate match asynchronously (with a small delay to demonstrate async behavior)
    // Note: For production, replace setTimeout with a proper job queue system (Bull, BullMQ)
    setTimeout(async () => {
      try {
        const { homeScore, awayScore } = await simulateMatch(
          match.home_team_id,
          match.away_team_id
        );

        // Update match with results
        await query(
          `UPDATE matches 
           SET home_score = $1, away_score = $2, status = 'completed', completed_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [homeScore, awayScore, id]
        );

        // Update team statistics
        const updateTeamStats = async (teamId: number, goalsFor: number, goalsAgainst: number) => {
          const points = goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? 1 : 0;
          const wins = goalsFor > goalsAgainst ? 1 : 0;
          const draws = goalsFor === goalsAgainst ? 1 : 0;
          const losses = goalsFor < goalsAgainst ? 1 : 0;

          await query(
            `UPDATE teams
             SET points = points + $1,
                 wins = wins + $2,
                 draws = draws + $3,
                 losses = losses + $4,
                 goals_for = goals_for + $5,
                 goals_against = goals_against + $6
             WHERE id = $7`,
            [points, wins, draws, losses, goalsFor, goalsAgainst, teamId]
          );
        };

        await updateTeamStats(match.home_team_id, homeScore, awayScore);
        await updateTeamStats(match.away_team_id, awayScore, homeScore);

        console.log(`Match ${id} completed: ${match.home_team_name} ${homeScore} - ${awayScore} ${match.away_team_name}`);
      } catch (error) {
        console.error('Error completing match simulation:', error);
      }
    }, 2000); // 2 second delay to simulate processing

    res.json({
      message: 'Match simulation started',
      match_id: id,
      status: 'in_progress',
    });
  } catch (error) {
    console.error('Error simulating match:', error);
    res.status(500).json({ error: 'Failed to simulate match' });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT m.*, ht.name as home_team_name, at.name as away_team_name
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.id
       JOIN teams at ON m.away_team_id = at.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
};

export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT m.*, ht.name as home_team_name, at.name as away_team_name
       FROM matches m
       JOIN teams ht ON m.home_team_id = ht.id
       JOIN teams at ON m.away_team_id = at.id
       ORDER BY m.match_date DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};
