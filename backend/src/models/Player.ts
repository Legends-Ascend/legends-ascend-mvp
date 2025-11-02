export interface Player {
  id?: number;
  name: string;
  position: string;
  overall_rating: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  created_at?: Date;
}

export type CreatePlayerDTO = Omit<Player, 'id' | 'created_at'>;
export type UpdatePlayerDTO = Partial<CreatePlayerDTO>;
