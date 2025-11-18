import { query } from '../config/database';
import { Squad, CreateSquadRequest, UpdateLineupRequest, generatePositionSlots, isPositionCompatible } from '../models/Squad';

/**
 * Service for managing squads and lineups (US-044)
 */
export class SquadService {
  /**
   * Create a new squad for a user
   */
  async createSquad(userId: string, squadData: CreateSquadRequest) {
    // Check if squad name already exists for this user
    const existingSquad = await query(
      'SELECT id FROM squads WHERE user_id = $1 AND name = $2',
      [userId, squadData.name]
    );

    if (existingSquad.rows.length > 0) {
      throw new Error('SQUAD_NAME_EXISTS');
    }

    // If is_active is true, deactivate other squads
    if (squadData.is_active) {
      await query(
        'UPDATE squads SET is_active = false WHERE user_id = $1',
        [userId]
      );
    }

    // Create squad
    const squadResult = await query(
      `INSERT INTO squads (user_id, name, formation, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, name, formation, is_active, created_at, updated_at`,
      [userId, squadData.name, squadData.formation, squadData.is_active]
    );

    const squad = squadResult.rows[0];

    // Generate position slots based on formation
    const positions = generatePositionSlots(squadData.formation);

    // Insert squad positions
    const positionInserts = positions.map((pos) =>
      query(
        `INSERT INTO squad_positions (squad_id, position_slot, slot_type, player_id)
         VALUES ($1, $2, $3, NULL)
         RETURNING id, squad_id, player_id, position_slot, slot_type, created_at, updated_at`,
        [squad.id, pos.position_slot, pos.slot_type]
      )
    );

    const positionResults = await Promise.all(positionInserts);
    const squadPositions = positionResults.map((result) => result.rows[0]);

    return {
      id: squad.id,
      user_id: squad.user_id,
      name: squad.name,
      formation: squad.formation,
      is_active: squad.is_active,
      created_at: squad.created_at.toISOString(),
      updated_at: squad.updated_at.toISOString(),
      positions: squadPositions.map((pos) => ({
        id: pos.id,
        position_slot: pos.position_slot,
        slot_type: pos.slot_type,
        player_id: pos.player_id,
      })),
    };
  }

  /**
   * Get squad details by ID
   */
  async getSquadById(squadId: string, userId: string, includeStats: boolean = false) {
    // Get squad
    const squadResult = await query(
      'SELECT id, user_id, name, formation, is_active, created_at, updated_at FROM squads WHERE id = $1',
      [squadId]
    );

    if (squadResult.rows.length === 0) {
      throw new Error('SQUAD_NOT_FOUND');
    }

    const squad = squadResult.rows[0];

    // Check ownership
    if (squad.user_id !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Get squad positions with player details
    const positionsResult = await query(
      `SELECT 
        sp.id, sp.position_slot, sp.slot_type, sp.player_id,
        p.name, p.position, p.rarity, p.base_overall, p.tier,
        p.pace, p.shooting, p.passing, p.dribbling, p.defending, p.physical
       FROM squad_positions sp
       LEFT JOIN players p ON sp.player_id = p.id
       WHERE sp.squad_id = $1
       ORDER BY 
         CASE sp.slot_type 
           WHEN 'STARTER' THEN 0 
           ELSE 1 
         END,
         sp.position_slot`,
      [squadId]
    );

    const positions = positionsResult.rows.map((row) => ({
      id: row.id,
      position_slot: row.position_slot,
      slot_type: row.slot_type,
      player_id: row.player_id,
      player: row.player_id ? {
        id: row.player_id,
        name: row.name,
        position: row.position,
        rarity: row.rarity,
        base_overall: row.base_overall,
        tier: row.tier,
        ...(includeStats && {
          pace: row.pace,
          shooting: row.shooting,
          passing: row.passing,
          dribbling: row.dribbling,
          defending: row.defending,
          physical: row.physical,
        }),
      } : null,
    }));

    const startersCount = positions.filter((p) => p.slot_type === 'STARTER').length;
    const benchCount = positions.filter((p) => p.slot_type === 'BENCH').length;
    const filledPositions = positions.filter((p) => p.player_id !== null).length;
    const emptyPositions = positions.length - filledPositions;

    return {
      id: squad.id,
      user_id: squad.user_id,
      name: squad.name,
      formation: squad.formation,
      is_active: squad.is_active,
      created_at: squad.created_at.toISOString(),
      updated_at: squad.updated_at.toISOString(),
      positions,
      starters_count: startersCount,
      bench_count: benchCount,
      filled_positions: filledPositions,
      empty_positions: emptyPositions,
    };
  }

  /**
   * Update squad lineup
   */
  async updateLineup(squadId: string, userId: string, lineupData: UpdateLineupRequest, userOwnsPlayer: (userId: string, playerId: string) => Promise<boolean>) {
    // Verify squad exists and belongs to user
    const squadResult = await query(
      'SELECT user_id FROM squads WHERE id = $1',
      [squadId]
    );

    if (squadResult.rows.length === 0) {
      throw new Error('SQUAD_NOT_FOUND');
    }

    if (squadResult.rows[0].user_id !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Validate all players are owned by user and positions are compatible
    const playerIds = lineupData.positions
      .filter((pos) => pos.player_id !== null)
      .map((pos) => pos.player_id as string);

    // Check for duplicate player assignments in the request
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== playerIds.length) {
      throw new Error('DUPLICATE_ASSIGNMENT');
    }

    // Verify all players exist and are owned by user
    for (const position of lineupData.positions) {
      if (position.player_id) {
        // Check ownership
        const isOwned = await userOwnsPlayer(userId, position.player_id);
        if (!isOwned) {
          throw new Error('PLAYER_NOT_IN_INVENTORY');
        }

        // Get player position
        const playerResult = await query(
          'SELECT position FROM players WHERE id = $1',
          [position.player_id]
        );

        if (playerResult.rows.length === 0) {
          throw new Error('PLAYER_NOT_FOUND');
        }

        const playerPosition = playerResult.rows[0].position;

        // Check position compatibility
        if (!isPositionCompatible(playerPosition, position.position_slot)) {
          throw new Error('POSITION_MISMATCH');
        }
      }
    }

    // Check if any player is already assigned to another position in this squad
    // We need to do this before updating
    const currentAssignments = await query(
      'SELECT player_id, position_slot FROM squad_positions WHERE squad_id = $1 AND player_id IS NOT NULL',
      [squadId]
    );

    const currentMap = new Map<string, string>();
    currentAssignments.rows.forEach((row) => {
      currentMap.set(row.player_id, row.position_slot);
    });

    // Check for conflicts
    for (const position of lineupData.positions) {
      if (position.player_id) {
        const currentSlot = currentMap.get(position.player_id);
        if (currentSlot && currentSlot !== position.position_slot) {
          // This player is being moved - that's OK
          // But we need to ensure no other position in the request also tries to use this player
          const assignmentCount = lineupData.positions.filter(
            (p) => p.player_id === position.player_id
          ).length;
          if (assignmentCount > 1) {
            throw new Error('DUPLICATE_ASSIGNMENT');
          }
        }
      }
    }

    // Update positions
    for (const position of lineupData.positions) {
      await query(
        `UPDATE squad_positions 
         SET player_id = $1, updated_at = CURRENT_TIMESTAMP
         WHERE squad_id = $2 AND position_slot = $3`,
        [position.player_id, squadId, position.position_slot]
      );
    }

    // Update squad's updated_at timestamp
    await query(
      'UPDATE squads SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [squadId]
    );

    // Return updated squad
    return this.getSquadById(squadId, userId, true);
  }
}
