import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Player } from '../../types';
import { playerApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const PlayerCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PlayerName = styled.h3`
  margin: 0 0 10px 0;
  color: #2c3e50;
`;

const PlayerInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const RatingBadge = styled.span<{ rating: number }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  background: ${props => 
    props.rating >= 80 ? '#27ae60' :
    props.rating >= 70 ? '#f39c12' :
    '#e74c3c'
  };
  color: white;
`;

const FormContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

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

const DeleteButton = styled(Button)`
  background: #e74c3c;
  padding: 5px 10px;
  font-size: 12px;

  &:hover {
    background: #c0392b;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const positions = ['GK', 'LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LW', 'ST', 'RW'];

export const PlayerRoster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: 'ST',
    overall_rating: 75,
    pace: 75,
    shooting: 75,
    passing: 75,
    dribbling: 75,
    defending: 75,
    physical: 75,
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await playerApi.getAll();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await playerApi.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        position: 'ST',
        overall_rating: 75,
        pace: 75,
        shooting: 75,
        passing: 75,
        dribbling: 75,
        defending: 75,
        physical: 75,
      });
      fetchPlayers();
    } catch (err) {
      setError('Failed to create player');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerApi.delete(id);
        fetchPlayers();
      } catch (err) {
        setError('Failed to delete player');
      }
    }
  };

  if (loading) return <Container>Loading players...</Container>;

  return (
    <Container>
      <Title>Player Roster</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Player'}
      </Button>

      {showForm && (
        <FormContainer>
          <FormTitle>Create New Player</FormTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Position</Label>
              <Select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              >
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Overall Rating</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.overall_rating}
                onChange={(e) => setFormData({ ...formData, overall_rating: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Pace</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.pace}
                onChange={(e) => setFormData({ ...formData, pace: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Shooting</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.shooting}
                onChange={(e) => setFormData({ ...formData, shooting: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Passing</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.passing}
                onChange={(e) => setFormData({ ...formData, passing: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Dribbling</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.dribbling}
                onChange={(e) => setFormData({ ...formData, dribbling: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Defending</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.defending}
                onChange={(e) => setFormData({ ...formData, defending: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Physical</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.physical}
                onChange={(e) => setFormData({ ...formData, physical: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Button type="submit">Create Player</Button>
            </FormGroup>
          </Form>
        </FormContainer>
      )}

      <PlayerGrid>
        {players.map(player => (
          <PlayerCard key={player.id}>
            <PlayerName>{player.name}</PlayerName>
            <PlayerInfo>
              <StatRow>
                <span>Position:</span>
                <strong>{player.position}</strong>
              </StatRow>
              <StatRow>
                <span>Overall:</span>
                <RatingBadge rating={player.overall_rating}>
                  {player.overall_rating}
                </RatingBadge>
              </StatRow>
              <StatRow>
                <span>Pace:</span>
                <span>{player.pace}</span>
              </StatRow>
              <StatRow>
                <span>Shooting:</span>
                <span>{player.shooting}</span>
              </StatRow>
              <StatRow>
                <span>Passing:</span>
                <span>{player.passing}</span>
              </StatRow>
              <StatRow>
                <span>Dribbling:</span>
                <span>{player.dribbling}</span>
              </StatRow>
              <StatRow>
                <span>Defending:</span>
                <span>{player.defending}</span>
              </StatRow>
              <StatRow>
                <span>Physical:</span>
                <span>{player.physical}</span>
              </StatRow>
            </PlayerInfo>
            <div style={{ marginTop: '10px' }}>
              <DeleteButton onClick={() => handleDelete(player.id!)}>
                Delete
              </DeleteButton>
            </div>
          </PlayerCard>
        ))}
      </PlayerGrid>

      {players.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No players found. Add your first player!
        </div>
      )}
    </Container>
  );
};
