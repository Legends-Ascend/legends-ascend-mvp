export interface Match {
  id?: number;
  home_team_id: number;
  away_team_id: number;
  home_score?: number;
  away_score?: number;
  status?: 'pending' | 'in_progress' | 'completed';
  match_date?: Date;
  completed_at?: Date;
}

export interface MatchResult {
  match_id: number;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  winner?: string;
}
