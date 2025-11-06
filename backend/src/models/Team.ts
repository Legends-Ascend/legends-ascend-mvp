export interface Team {
  id?: number;
  name: string;
  points?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goals_for?: number;
  goals_against?: number;
  created_at?: Date;
}

export interface TeamLineup {
  id?: number;
  team_id: number;
  player_id: number;
  position_in_lineup: string;
}

export type CreateTeamDTO = Pick<Team, 'name'>;
