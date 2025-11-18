import { z } from 'zod';

// Formation positions mapping
export const FORMATION_POSITIONS: Record<string, { starters: { [key: string]: number }, bench: number }> = {
  '4-3-3': {
    starters: { GK: 1, DF: 4, MF: 3, FW: 3 },
    bench: 7
  },
  '4-2-4': {
    starters: { GK: 1, DF: 4, MF: 2, FW: 4 },
    bench: 7
  },
  '5-3-2': {
    starters: { GK: 1, DF: 5, MF: 3, FW: 2 },
    bench: 7
  },
  '3-5-2': {
    starters: { GK: 1, DF: 3, MF: 5, FW: 2 },
    bench: 7
  },
  '4-4-2': {
    starters: { GK: 1, DF: 4, MF: 4, FW: 2 },
    bench: 7
  },
};

// Squad schema (US-044)
export const SquadSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  formation: z.enum(['4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2']),
  is_active: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Squad = z.infer<typeof SquadSchema>;

// Create squad request body
export const CreateSquadSchema = z.object({
  name: z.string().min(1).max(100),
  formation: z.enum(['4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2']),
  is_active: z.boolean().optional().default(false),
});

export type CreateSquadRequest = z.infer<typeof CreateSquadSchema>;

// Squad Position schema (US-044)
export const SquadPositionSchema = z.object({
  id: z.string().uuid(),
  squad_id: z.string().uuid(),
  player_id: z.string().uuid().nullable(),
  position_slot: z.string(),
  slot_type: z.enum(['STARTER', 'BENCH']),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type SquadPosition = z.infer<typeof SquadPositionSchema>;

// Position assignment for lineup update
export const PositionAssignmentSchema = z.object({
  position_slot: z.string(),
  player_id: z.string().uuid().nullable(),
});

export type PositionAssignment = z.infer<typeof PositionAssignmentSchema>;

// Update lineup request body
export const UpdateLineupSchema = z.object({
  positions: z.array(PositionAssignmentSchema).min(1),
});

export type UpdateLineupRequest = z.infer<typeof UpdateLineupSchema>;

/**
 * Generate position slots for a given formation
 */
export function generatePositionSlots(formation: string): Array<{ position_slot: string; slot_type: 'STARTER' | 'BENCH' }> {
  const positions: Array<{ position_slot: string; slot_type: 'STARTER' | 'BENCH' }> = [];
  const config = FORMATION_POSITIONS[formation];

  if (!config) {
    throw new Error(`Invalid formation: ${formation}`);
  }

  // Generate starter positions
  Object.entries(config.starters).forEach(([posType, count]) => {
    for (let i = 1; i <= count; i++) {
      positions.push({
        position_slot: `${posType}_${i}`,
        slot_type: 'STARTER',
      });
    }
  });

  // Generate bench positions
  for (let i = 1; i <= config.bench; i++) {
    positions.push({
      position_slot: `BENCH_${i}`,
      slot_type: 'BENCH',
    });
  }

  return positions;
}

/**
 * Check if a player position is compatible with a position slot
 */
export function isPositionCompatible(playerPosition: string, positionSlot: string): boolean {
  // Utility players can play anywhere
  if (playerPosition === 'UT') {
    return true;
  }

  // Bench can accept any position
  if (positionSlot.startsWith('BENCH_')) {
    return true;
  }

  // Extract position type from slot (e.g., "GK_1" -> "GK")
  const slotType = positionSlot.split('_')[0];
  
  return playerPosition === slotType;
}
