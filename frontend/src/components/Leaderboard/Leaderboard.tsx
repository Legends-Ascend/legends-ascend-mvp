import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { LeaderboardEntry } from '../../types';
import { teamApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #3498db;
  color: white;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;

  &:first-child {
    width: 50px;
    text-align: center;
  }
`;

const Tbody = styled.tbody`
  tr:nth-child(even) {
    background: #f8f9fa;
  }

  tr:hover {
    background: #e9ecef;
  }
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #dee2e6;

  &:first-child {
    text-align: center;
    font-weight: bold;
  }
`;

const Position = styled.div<{ position: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => 
    props.position === 1 ? '#FFD700' :
    props.position === 2 ? '#C0C0C0' :
    props.position === 3 ? '#CD7F32' :
    '#ecf0f1'
  };
  color: ${props => props.position <= 3 ? 'white' : '#333'};
  font-weight: bold;
`;

const TeamName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const StatHighlight = styled.span<{ positive?: boolean; negative?: boolean }>`
  color: ${props => 
    props.positive ? '#27ae60' :
    props.negative ? '#e74c3c' :
    '#333'
  };
  font-weight: 600;
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

const RefreshButton = styled.button`
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }
`;

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getLeaderboard();
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container>Loading leaderboard...</Container>;

  return (
    <Container>
      <Title>Leaderboard</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <RefreshButton onClick={fetchLeaderboard}>
        Refresh Leaderboard
      </RefreshButton>

      {leaderboard.length > 0 ? (
        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th>Pos</Th>
                <Th>Team</Th>
                <Th>MP</Th>
                <Th>W</Th>
                <Th>D</Th>
                <Th>L</Th>
                <Th>GF</Th>
                <Th>GA</Th>
                <Th>GD</Th>
                <Th>Pts</Th>
              </tr>
            </Thead>
            <Tbody>
              {leaderboard.map((team, index) => (
                <tr key={team.id}>
                  <Td>
                    <Position position={index + 1}>
                      {index + 1}
                    </Position>
                  </Td>
                  <Td>
                    <TeamName>{team.name}</TeamName>
                  </Td>
                  <Td>{team.matches_played}</Td>
                  <Td>{team.wins}</Td>
                  <Td>{team.draws}</Td>
                  <Td>{team.losses}</Td>
                  <Td>{team.goals_for}</Td>
                  <Td>{team.goals_against}</Td>
                  <Td>
                    <StatHighlight
                      positive={team.goal_difference > 0}
                      negative={team.goal_difference < 0}
                    >
                      {team.goal_difference > 0 ? '+' : ''}
                      {team.goal_difference}
                    </StatHighlight>
                  </Td>
                  <Td>
                    <StatHighlight positive>
                      {team.points}
                    </StatHighlight>
                  </Td>
                </tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState>
          No teams in the leaderboard yet. Create teams and play matches to see standings!
        </EmptyState>
      )}
    </Container>
  );
};
