# Setup Guide for Legends Ascend MVP

This guide will help you set up and run the Legends Ascend football manager MVP on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Legends-Ascend/legends-ascend-mvp.git
cd legends-ascend-mvp
```

### 2. Database Setup

#### Option A: Using createdb command

```bash
createdb legends_ascend
```

#### Option B: Using psql

```bash
psql -U postgres
CREATE DATABASE legends_ascend;
\q
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
PORT=3000
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/legends_ascend
NODE_ENV=development
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

The default configuration should work for local development:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Build Both Applications

Build the backend:

```bash
cd ../backend
npm run build
```

Build the frontend:

```bash
cd ../frontend
npm run build
```

## Running the Application

You'll need two terminal windows/tabs to run both the backend and frontend servers.

### Terminal 1: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
Database tables initialized successfully
Server is running on port 3000
```

### Terminal 2: Start the Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Access the Application

Open your web browser and navigate to:

```
http://localhost:5173
```

## Optional: Seed Sample Data

To populate the database with sample players and teams:

```bash
cd backend
npm run seed
```

This will create:
- 13 sample players with realistic stats
- 6 sample teams (FC Barcelona, Real Madrid, Manchester United, Bayern Munich, Paris Saint-Germain, Liverpool FC)

## Troubleshooting

### Database Connection Issues

**Error**: `connection refused` or `database does not exist`

**Solution**:
1. Make sure PostgreSQL is running:
   ```bash
   # On macOS
   brew services start postgresql
   
   # On Linux
   sudo service postgresql start
   
   # On Windows
   # Use Services app or pg_ctl start
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

3. Check your credentials in `.env` file

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
1. Find and kill the process using port 3000:
   ```bash
   # On macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the port in `backend/.env`:
   ```env
   PORT=3001
   ```
   And update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

### TypeScript Compilation Errors

**Solution**:
1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear TypeScript cache:
   ```bash
   rm -rf dist
   npm run build
   ```

### Frontend Not Loading

**Solution**:
1. Clear browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors
3. Verify backend is running and accessible at `http://localhost:3000/api/health`

## Verification Steps

### 1. Check Backend Health

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","message":"Legends Ascend API is running"}
```

### 2. Test API Endpoints

Get all players:
```bash
curl http://localhost:3000/api/players
```

Get all teams:
```bash
curl http://localhost:3000/api/teams
```

### 3. Check Database Tables

```bash
psql -U postgres -d legends_ascend

\dt  # List all tables
SELECT COUNT(*) FROM players;
SELECT COUNT(*) FROM teams;
\q
```

## Production Deployment

For production deployment:

1. **Backend**:
   ```bash
   cd backend
   npm run build
   NODE_ENV=production npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run build
   # Serve the dist/ folder with your web server (nginx, Apache, etc.)
   ```

3. Update environment variables for production database and API URLs

## Getting Help

If you encounter issues:

1. Check the [README.md](./README.md) for general information
2. Review the [Issues](https://github.com/Legends-Ascend/legends-ascend-mvp/issues) page
3. Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - PostgreSQL version (`psql --version`)
   - Complete error message
   - Steps to reproduce

## Next Steps

Once the application is running:

1. **Create Players**: Go to the Players tab and add some players
2. **Build Teams**: Create teams in the Team Lineup tab
3. **Add Players to Lineups**: Build your team lineups
4. **Simulate Matches**: Create and simulate matches
5. **Check Standings**: View the leaderboard to see team rankings

Enjoy managing your football team! ⚽
