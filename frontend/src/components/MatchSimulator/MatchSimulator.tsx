import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Team, Match } from '../../types';
import { teamApi, matchApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  flex: 1;

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

const SimulateButton = styled(Button)`
  background: #27ae60;

  &:hover {
    background: #229954;
  }
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MatchCard = styled.div<{ status: string }>`
  background: white;
  border: 1px solid #ddd;
  border-left: 4px solid ${props => 
    props.status === 'completed' ? '#27ae60' :
    props.status === 'in_progress' ? '#f39c12' :
    '#3498db'
  };
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MatchTeams = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

const MatchScore = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #27ae60;
`;

const MatchStatus = styled.div<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => 
    props.status === 'completed' ? '#d4edda' :
    props.status === 'in_progress' ? '#fff3cd' :
    '#d1ecf1'
  };
  color: ${props => 
    props.status === 'completed' ? '#155724' :
    props.status === 'in_progress' ? '#856404' :
    '#0c5460'
  };
`;

const MatchDate = styled.div`
  font-size: 12px;
  color: #999;
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

export const MatchSimulator: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await teamApi.getAll();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams');
    }
  };

  const fetchMatches = async () => {
    try {
      const data = await matchApi.getAll();
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches');
    }
  };

  const handleCreateMatch = async () => {
    if (!homeTeamId || !awayTeamId) {
      setError('Please select both teams');
      return;
    }

    if (homeTeamId === awayTeamId) {
      setError('Cannot create a match with the same team');
      return;
    }

    try {
      setLoading(true);
      await matchApi.create(homeTeamId, awayTeamId);
      setHomeTeamId(null);
      setAwayTeamId(null);
      setError(null);
      fetchMatches();
    } catch (err) {
      setError('Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateMatch = async (matchId: number) => {
    try {
      setLoading(true);
      await matchApi.simulate(matchId);
      setError(null);
      
      // Poll for match completion
      const pollInterval = setInterval(async () => {
        const match = await matchApi.getById(matchId);
        if (match.status === 'completed') {
          clearInterval(pollInterval);
          fetchMatches();
          setLoading(false);
        }
      }, 1000);

      // Stop polling after 10 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        fetchMatches();
        setLoading(false);
      }, 10000);
    } catch (err) {
      setError('Failed to simulate match');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Container>
      <Title>Match Simulator</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Section>
        <SectionTitle>Create New Match</SectionTitle>
        <FormGroup>
          <Select
            value={homeTeamId || ''}
            onChange={(e) => setHomeTeamId(Number(e.target.value))}
          >
            <option value="">Select Home Team...</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Select>
          <span>vs</span>
          <Select
            value={awayTeamId || ''}
            onChange={(e) => setAwayTeamId(Number(e.target.value))}
          >
            <option value="">Select Away Team...</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Select>
          <Button onClick={handleCreateMatch} disabled={loading}>
            Create Match
          </Button>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Matches</SectionTitle>
        {matches.length > 0 ? (
          <MatchList>
            {matches.map(match => (
              <MatchCard key={match.id} status={match.status}>
                <MatchHeader>
                  <div>
                    <MatchTeams>
                      {match.home_team_name} vs {match.away_team_name}
                    </MatchTeams>
                    <MatchDate>{formatDate(match.match_date)}</MatchDate>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {match.status === 'completed' && (
                      <MatchScore>
                        {match.home_score} - {match.away_score}
                      </MatchScore>
                    )}
                    <MatchStatus status={match.status}>
                      {match.status.replace('_', ' ').toUpperCase()}
                    </MatchStatus>
                  </div>
                </MatchHeader>
                {match.status === 'pending' && (
                  <SimulateButton
                    onClick={() => handleSimulateMatch(match.id)}
                    disabled={loading}
                  >
                    {loading ? 'Simulating...' : 'Simulate Match'}
                  </SimulateButton>
                )}
                {match.status === 'in_progress' && (
                  <div style={{ color: '#856404' }}>Match in progress...</div>
                )}
              </MatchCard>
            ))}
          </MatchList>
        ) : (
          <EmptyState>No matches yet. Create your first match!</EmptyState>
        )}
      </Section>
    </Container>
  );
};
