# Legends Ascend MVP

A football manager game MVP built with React, TypeScript, Node.js, Express, and PostgreSQL. Manage players, build team lineups, simulate matches, and track your standings on the leaderboard.

## 🎮 Features

- **Player Roster System**: Create, view, and manage players with detailed stats (pace, shooting, passing, dribbling, defending, physical)
- **Team Lineup Manager**: Create teams and build custom lineups with your players
- **Async Match Simulator**: Simulate matches between teams with realistic scoring based on player stats
- **Leaderboard**: Track team standings with points, wins, draws, losses, and goal differences

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Styled Components for styling
- Modern responsive UI

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- RESTful API design

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🚀 Getting Started

> **Quick Start**: Want to get running fast? See [QUICKSTART.md](./QUICKSTART.md)  
> **Detailed Setup**: For step-by-step instructions and troubleshooting, see [SETUP.md](./SETUP.md)

### 1. Clone the Repository

```bash
git clone https://github.com/Legends-Ascend/legends-ascend-mvp.git
cd legends-ascend-mvp
```

### 2. Set Up the Database

Create a PostgreSQL database:

```bash
createdb legends_ascend
```

Or using psql:

```sql
CREATE DATABASE legends_ascend;
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/legends_ascend
NODE_ENV=development
```

Install backend dependencies:

```bash
npm install
```

### 4. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

The default configuration points to `http://localhost:3000/api`. Modify if needed.

Install frontend dependencies:

```bash
npm install
```

### 5. Start the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3000` and automatically create database tables.

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📚 API Endpoints

### Players

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player

### Teams

- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id/lineup` - Get team lineup
- `POST /api/teams/:id/lineup` - Add player to lineup
- `DELETE /api/teams/:id/lineup/:playerId` - Remove player from lineup
- `GET /api/teams/leaderboard/all` - Get leaderboard standings

### Matches

- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create a new match
- `POST /api/matches/:id/simulate` - Simulate a match (async)

## 🎯 How to Use

### 1. Create Players

1. Navigate to the "Players" tab
2. Click "Add New Player"
3. Fill in player details (name, position, stats)
4. Click "Create Player"

### 2. Build Your Team

1. Navigate to the "Team Lineup" tab
2. Create a new team or select an existing one
3. Add players to your lineup by selecting them and choosing their position
4. Build a balanced squad with the right mix of skills

### 3. Simulate Matches

1. Navigate to the "Match Simulator" tab
2. Select home and away teams
3. Click "Create Match"
4. Click "Simulate Match" to run the simulation
5. Match results are calculated based on team strength and player stats

### 4. Check the Leaderboard

1. Navigate to the "Leaderboard" tab
2. View team standings sorted by points
3. See detailed stats: matches played, wins, draws, losses, goals, goal difference

## 🏗️ Project Structure

```
legends-ascend-mvp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       # Database configuration and initialization
│   │   ├── controllers/
│   │   │   ├── playerController.ts
│   │   │   ├── teamController.ts
│   │   │   └── matchController.ts
│   │   ├── models/
│   │   │   ├── Player.ts
│   │   │   ├── Team.ts
│   │   │   └── Match.ts
│   │   ├── routes/
│   │   │   ├── playerRoutes.ts
│   │   │   ├── teamRoutes.ts
│   │   │   └── matchRoutes.ts
│   │   └── index.ts              # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlayerRoster/
│   │   │   │   └── PlayerRoster.tsx
│   │   │   ├── TeamLineup/
│   │   │   │   └── TeamLineup.tsx
│   │   │   ├── MatchSimulator/
│   │   │   │   └── MatchSimulator.tsx
│   │   │   └── Leaderboard/
│   │   │       └── Leaderboard.tsx
│   │   ├── services/
│   │   │   └── api.ts            # API service layer
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript type definitions
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🔧 Development Commands

### Backend

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

### Frontend

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Database Schema

### Players Table
- id (PRIMARY KEY)
- name
- position
- overall_rating (1-100)
- pace (1-100)
- shooting (1-100)
- passing (1-100)
- dribbling (1-100)
- defending (1-100)
- physical (1-100)
- created_at

### Teams Table
- id (PRIMARY KEY)
- name
- points (default 0)
- wins (default 0)
- draws (default 0)
- losses (default 0)
- goals_for (default 0)
- goals_against (default 0)
- created_at

### Team Lineups Table
- id (PRIMARY KEY)
- team_id (FOREIGN KEY → teams)
- player_id (FOREIGN KEY → players)
- position_in_lineup

### Matches Table
- id (PRIMARY KEY)
- home_team_id (FOREIGN KEY → teams)
- away_team_id (FOREIGN KEY → teams)
- home_score
- away_score
- status (pending | in_progress | completed)
- match_date
- completed_at

## 🎨 UI Features

- Responsive design that works on desktop and mobile
- Clean, modern interface with styled components
- Real-time updates for match simulation
- Color-coded ratings and statistics
- Interactive navigation between different sections

## 🔒 Security Notes

- The `.env` files contain sensitive information and should never be committed
- In production, use proper authentication and authorization
- Validate all user inputs on the backend
- Use environment variables for all configuration

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.
