import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Team, Player, TeamLineupPlayer } from '../../types';
import { teamApi, playerApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const TeamSelector = styled.div`
  margin-bottom: 30px;
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-width: 200px;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const LineupGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlayerItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlayerDetails = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const PlayerStats = styled.div`
  font-size: 12px;
  color: #666;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #c0392b;
  }
`;

const AddButton = styled(Button)`
  background: #27ae60;

  &:hover {
    background: #229954;
  }
`;

const FormGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

const positions = ['GK', 'LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LW', 'ST', 'RW'];

export const TeamLineup: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [lineup, setLineup] = useState<TeamLineupPlayer[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('ST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      fetchLineup();
    }
  }, [selectedTeamId]);

  const fetchTeams = async () => {
    try {
      const data = await teamApi.getAll();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams');
    }
  };

  const fetchPlayers = async () => {
    try {
      const data = await playerApi.getAll();
      setAvailablePlayers(data);
    } catch (err) {
      setError('Failed to load players');
    }
  };

  const fetchLineup = async () => {
    if (!selectedTeamId) return;
    try {
      setLoading(true);
      const data = await teamApi.getLineup(selectedTeamId);
      setLineup(data);
      setError(null);
    } catch (err) {
      setError('Failed to load lineup');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    try {
      const newTeam = await teamApi.create(newTeamName);
      setNewTeamName('');
      await fetchTeams();
      if (newTeam.id) {
        setSelectedTeamId(newTeam.id);
      }
    } catch (err) {
      setError('Failed to create team');
    }
  };

  const handleAddPlayer = async () => {
    if (!selectedTeamId || !selectedPlayerId) return;
    try {
      await teamApi.addPlayerToLineup(selectedTeamId, selectedPlayerId, selectedPosition);
      setSelectedPlayerId(null);
      fetchLineup();
    } catch (err) {
      setError('Failed to add player to lineup');
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    if (!selectedTeamId) return;
    try {
      await teamApi.removePlayerFromLineup(selectedTeamId, playerId);
      fetchLineup();
    } catch (err) {
      setError('Failed to remove player from lineup');
    }
  };

  const lineupPlayerIds = new Set(lineup.map(p => p.player_id));
  const playersNotInLineup = availablePlayers.filter(p => !lineupPlayerIds.has(p.id));

  return (
    <Container>
      <Title>Team Lineup</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TeamSelector>
        <FormGroup>
          <Input
            type="text"
            placeholder="New team name..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <Button onClick={handleCreateTeam}>Create Team</Button>
        </FormGroup>

        <Select
          value={selectedTeamId || ''}
          onChange={(e) => setSelectedTeamId(Number(e.target.value))}
        >
          <option value="">Select a team...</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </Select>
      </TeamSelector>

      {selectedTeamId && (
        <LineupGrid>
          <Section>
            <SectionTitle>Current Lineup ({lineup.length} players)</SectionTitle>
            {loading ? (
              <div>Loading lineup...</div>
            ) : lineup.length > 0 ? (
              <PlayerList>
                {lineup.map(player => (
                  <PlayerItem key={player.player_id}>
                    <PlayerDetails>
                      <PlayerName>
                        {player.name} ({player.position_in_lineup})
                      </PlayerName>
                      <PlayerStats>
                        {player.position} • OVR: {player.overall_rating} • 
                        PAC: {player.pace} SHO: {player.shooting} PAS: {player.passing}
                      </PlayerStats>
                    </PlayerDetails>
                    <RemoveButton onClick={() => handleRemovePlayer(player.player_id)}>
                      Remove
                    </RemoveButton>
                  </PlayerItem>
                ))}
              </PlayerList>
            ) : (
              <EmptyState>No players in lineup yet</EmptyState>
            )}
          </Section>

          <Section>
            <SectionTitle>Add Player to Lineup</SectionTitle>
            <FormGroup>
              <Select
                value={selectedPlayerId || ''}
                onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
              >
                <option value="">Select player...</option>
                {playersNotInLineup.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.position}) - OVR: {player.overall_rating}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </Select>
              <AddButton onClick={handleAddPlayer} disabled={!selectedPlayerId}>
                Add to Lineup
              </AddButton>
            </FormGroup>
          </Section>
        </LineupGrid>
      )}

      {!selectedTeamId && (
        <EmptyState>Please select or create a team to manage its lineup</EmptyState>
      )}
    </Container>
  );
};
