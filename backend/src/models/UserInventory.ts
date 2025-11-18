import { z } from 'zod';

// Player schema (US-044)
export const PlayerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  position: z.enum(['GK', 'DF', 'MF', 'FW', 'UT']),
  rarity: z.number().int().min(1).max(5),
  base_overall: z.number().int().min(40).max(99),
  tier: z.number().int().min(0).max(5).default(0),
  pace: z.number().int().min(1).max(100),
  shooting: z.number().int().min(1).max(100),
  passing: z.number().int().min(1).max(100),
  dribbling: z.number().int().min(1).max(100),
  defending: z.number().int().min(1).max(100),
  physical: z.number().int().min(1).max(100),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Player = z.infer<typeof PlayerSchema>;

// User Inventory schema (US-044)
export const UserInventorySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  player_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(50).default(1),
  acquired_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
});

export type UserInventory = z.infer<typeof UserInventorySchema>;

// Inventory response with player details
export const InventoryItemSchema = z.object({
  inventory_id: z.string().uuid(),
  player: PlayerSchema,
  quantity: z.number().int(),
  acquired_at: z.string().datetime(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

// Query parameters for inventory endpoint
export const InventoryQuerySchema = z.object({
  position: z.enum(['GK', 'DF', 'MF', 'FW', 'UT']).optional(),
  rarity: z.number().int().min(1).max(5).optional(),
  min_overall: z.number().int().min(40).max(99).optional(),
  max_overall: z.number().int().min(40).max(99).optional(),
  sort: z.enum(['name', 'base_overall', 'rarity', 'acquired_at']).default('acquired_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type InventoryQuery = z.infer<typeof InventoryQuerySchema>;
