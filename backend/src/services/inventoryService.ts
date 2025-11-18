import { query } from '../config/database';
import { InventoryQuery, InventoryItem } from '../models/UserInventory';

/**
 * Service for managing user player inventory (US-044)
 */
export class InventoryService {
  /**
   * Get user's player inventory with filtering, sorting, and pagination
   */
  async getUserInventory(userId: string, queryParams: InventoryQuery) {
    const {
      position,
      rarity,
      min_overall,
      max_overall,
      sort,
      order,
      page,
      limit,
    } = queryParams;

    // Build WHERE clause
    const conditions: string[] = ['ui.user_id = $1'];
    const params: any[] = [userId];
    let paramCount = 1;

    if (position) {
      paramCount++;
      conditions.push(`p.position = $${paramCount}`);
      params.push(position);
    }

    if (rarity !== undefined) {
      paramCount++;
      conditions.push(`p.rarity = $${paramCount}`);
      params.push(rarity);
    }

    if (min_overall !== undefined) {
      paramCount++;
      conditions.push(`p.base_overall >= $${paramCount}`);
      params.push(min_overall);
    }

    if (max_overall !== undefined) {
      paramCount++;
      conditions.push(`p.base_overall <= $${paramCount}`);
      params.push(max_overall);
    }

    const whereClause = conditions.join(' AND ');

    // Build ORDER BY clause
    const sortField = sort === 'name' ? 'p.name' : 
                      sort === 'base_overall' ? 'p.base_overall' :
                      sort === 'rarity' ? 'p.rarity' :
                      'ui.acquired_at';
    const orderDirection = order.toUpperCase();
    const orderBy = `${sortField} ${orderDirection}`;

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total 
       FROM user_inventory ui
       JOIN players p ON ui.player_id = p.id
       WHERE ${whereClause}`,
      params
    );
    const totalItems = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated results
    const result = await query(
      `SELECT 
        ui.id as inventory_id,
        ui.quantity,
        ui.acquired_at,
        p.id,
        p.name,
        p.position,
        p.rarity,
        p.base_overall,
        p.tier,
        p.pace,
        p.shooting,
        p.passing,
        p.dribbling,
        p.defending,
        p.physical
       FROM user_inventory ui
       JOIN players p ON ui.player_id = p.id
       WHERE ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const inventory: InventoryItem[] = result.rows.map((row) => ({
      inventory_id: row.inventory_id,
      player: {
        id: row.id,
        name: row.name,
        position: row.position,
        rarity: row.rarity,
        base_overall: row.base_overall,
        tier: row.tier,
        pace: row.pace,
        shooting: row.shooting,
        passing: row.passing,
        dribbling: row.dribbling,
        defending: row.defending,
        physical: row.physical,
      },
      quantity: row.quantity,
      acquired_at: row.acquired_at.toISOString(),
    }));

    return {
      inventory,
      pagination: {
        page,
        limit,
        total_items: totalItems,
        total_pages: totalPages,
      },
    };
  }

  /**
   * Check if a user owns a specific player
   */
  async userOwnsPlayer(userId: string, playerId: string): Promise<boolean> {
    const result = await query(
      'SELECT 1 FROM user_inventory WHERE user_id = $1 AND player_id = $2',
      [userId, playerId]
    );
    return result.rows.length > 0;
  }
}
