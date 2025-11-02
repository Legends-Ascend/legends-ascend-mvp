export interface Player {
  id: number;
  name: string;
  position: string;
  overall_rating: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Team {
  id: number;
  name: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
}

export interface TeamLineupPlayer extends Player {
  player_id: number;
  position_in_lineup: string;
}

export interface Match {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  status: 'pending' | 'in_progress' | 'completed';
  match_date: string;
  completed_at?: string;
}

export interface LeaderboardEntry extends Team {
  goal_difference: number;
  matches_played: number;
}
