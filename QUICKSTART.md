# Quick Start Guide

Get the Legends Ascend MVP running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v18+)
node --version

# Check PostgreSQL (need v14+)
psql --version

# Check npm
npm --version
```

If any are missing, install them first (see [SETUP.md](./SETUP.md) for installation links).

## 5-Minute Setup

### 1. Clone & Navigate

```bash
git clone https://github.com/Legends-Ascend/legends-ascend-mvp.git
cd legends-ascend-mvp
```

### 2. Create Database

```bash
# Quick way (macOS/Linux)
createdb legends_ascend

# Alternative (any platform)
psql -U postgres -c "CREATE DATABASE legends_ascend;"
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (default: postgresql://postgres:postgres@localhost:5432/legends_ascend)
npm run build
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run build
```

### 5. Start Everything

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait for: `Server is running on port 3000`

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### 6. Open App

Go to: **http://localhost:5173**

## Optional: Add Sample Data

In a third terminal:

```bash
cd backend
npm run seed
```

This adds 13 players and 6 teams to get started quickly.

## Usage Flow

1. **Players Tab** → Click "Add New Player" → Create a few players
2. **Team Lineup Tab** → Create a team → Add players to lineup
3. **Match Simulator** → Select two teams → Create and simulate match
4. **Leaderboard** → View team standings

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

### Database connection failed?
```bash
# Check if PostgreSQL is running
# macOS:
brew services list | grep postgresql

# Linux:
sudo service postgresql status

# Start if needed:
brew services start postgresql  # macOS
sudo service postgresql start    # Linux
```

### Need more help?
See [SETUP.md](./SETUP.md) for detailed instructions and troubleshooting.

---

**That's it!** You should now have a working football manager game. Create players, build teams, simulate matches, and climb the leaderboard! ⚽
