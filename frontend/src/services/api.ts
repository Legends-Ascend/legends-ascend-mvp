import type { Player, Team, Match, LeaderboardEntry, TeamLineupPlayer } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Player API
export const playerApi = {
  getAll: async (): Promise<Player[]> => {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  },

  getById: async (id: number): Promise<Player> => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`);
    if (!response.ok) throw new Error('Failed to fetch player');
    return response.json();
  },

  create: async (player: Omit<Player, 'id'>): Promise<Player> => {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    if (!response.ok) throw new Error('Failed to create player');
    return response.json();
  },

  update: async (id: number, player: Partial<Player>): Promise<Player> => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    if (!response.ok) throw new Error('Failed to update player');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete player');
  },
};

// Team API
export const teamApi = {
  getAll: async (): Promise<Team[]> => {
    const response = await fetch(`${API_BASE_URL}/teams`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  getById: async (id: number): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`);
    if (!response.ok) throw new Error('Failed to fetch team');
    return response.json();
  },

  create: async (name: string): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create team');
    return response.json();
  },

  getLineup: async (teamId: number): Promise<TeamLineupPlayer[]> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/lineup`);
    if (!response.ok) throw new Error('Failed to fetch team lineup');
    return response.json();
  },

  addPlayerToLineup: async (teamId: number, playerId: number, position: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/lineup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, position_in_lineup: position }),
    });
    if (!response.ok) throw new Error('Failed to add player to lineup');
  },

  removePlayerFromLineup: async (teamId: number, playerId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/lineup/${playerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove player from lineup');
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/teams/leaderboard/all`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
};

// Match API
export const matchApi = {
  getAll: async (): Promise<Match[]> => {
    const response = await fetch(`${API_BASE_URL}/matches`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return response.json();
  },

  getById: async (id: number): Promise<Match> => {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`);
    if (!response.ok) throw new Error('Failed to fetch match');
    return response.json();
  },

  create: async (homeTeamId: number, awayTeamId: number): Promise<Match> => {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_team_id: homeTeamId, away_team_id: awayTeamId }),
    });
    if (!response.ok) throw new Error('Failed to create match');
    return response.json();
  },

  simulate: async (matchId: number): Promise<{ message: string; match_id: number; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/simulate`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to simulate match');
    return response.json();
  },
};
