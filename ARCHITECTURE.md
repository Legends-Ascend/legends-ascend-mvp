# Architecture Overview

This document describes the architecture and technical decisions for the Legends Ascend MVP.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (Vite)                 │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   Players   │  │ Team Lineup │  │   Matches   │ │  │
│  │  │  Component  │  │  Component  │  │  Component  │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐│  │
│  │  │         API Service Layer (api.ts)              ││  │
│  │  └─────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express Server (Node.js)                    │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   Player    │  │    Team     │  │    Match    │ │  │
│  │  │   Routes    │  │   Routes    │  │   Routes    │ │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │  │
│  │         │                 │                 │        │  │
│  │  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐ │  │
│  │  │   Player    │  │    Team     │  │    Match    │ │  │
│  │  │ Controller  │  │ Controller  │  │ Controller  │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐│  │
│  │  │      Database Connection Pool (pg)              ││  │
│  │  └─────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              │
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                     │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐  ┌─────────┐  │
│  │ players │  │  teams  │  │team_lineups │  │ matches │  │
│  └─────────┘  └─────────┘  └─────────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Styled Components**: CSS-in-JS styling
- **Native Fetch API**: HTTP requests

### Backend
- **Node.js**: Runtime environment
- **Express 5**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: Relational database
- **node-postgres (pg)**: Database driver
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment configuration

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     players     │
├─────────────────┤
│ id (PK)         │───┐
│ name            │   │
│ position        │   │
│ overall_rating  │   │
│ pace            │   │
│ shooting        │   │
│ passing         │   │
│ dribbling       │   │
│ defending       │   │
│ physical        │   │
└─────────────────┘   │
                      │
┌─────────────────┐   │    ┌──────────────────┐
│      teams      │   │    │  team_lineups    │
├─────────────────┤   │    ├──────────────────┤
│ id (PK)         │───┼───→│ team_id (FK)     │
│ name            │   │    │ player_id (FK)   │←───
│ points          │   │    │ position_in_lineup│
│ wins            │   │    └──────────────────┘
│ draws           │   │
│ losses          │   │
│ goals_for       │   │
│ goals_against   │   │
└─────────────────┘   │
        │             │
        │             │
        ↓             │
┌─────────────────┐   │
│     matches     │   │
├─────────────────┤   │
│ id (PK)         │   │
│ home_team_id(FK)│───┘
│ away_team_id(FK)│───┘
│ home_score      │
│ away_score      │
│ status          │
│ match_date      │
│ completed_at    │
└─────────────────┘
```

## API Design

### RESTful Endpoints

**Players API**
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get player details
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

**Teams API**
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create new team
- `GET /api/teams/:id/lineup` - Get team lineup
- `POST /api/teams/:id/lineup` - Add player to lineup
- `DELETE /api/teams/:id/lineup/:playerId` - Remove player from lineup
- `GET /api/teams/leaderboard/all` - Get leaderboard

**Matches API**
- `GET /api/matches` - List all matches
- `GET /api/matches/:id` - Get match details
- `POST /api/matches` - Create new match
- `POST /api/matches/:id/simulate` - Simulate match (async)

## Key Features

### 1. Player Management
- CRUD operations for players
- Detailed stats (pace, shooting, passing, dribbling, defending, physical)
- Position-based categorization
- Overall rating system (1-100)

### 2. Team Lineup System
- Multiple teams support
- Flexible lineup building
- Position assignment for each player
- Prevents duplicate players in same lineup

### 3. Async Match Simulation
- Realistic scoring based on player stats
- Home advantage calculation
- Attack vs Defense mechanics
- Automatic statistics updates
- Status tracking (pending → in_progress → completed)

### 4. Leaderboard
- Points-based ranking (3 for win, 1 for draw, 0 for loss)
- Goal difference tiebreaker
- Comprehensive statistics display

## Design Patterns

### Backend

**MVC Pattern**
- **Models**: Data structures and types (`Player.ts`, `Team.ts`, `Match.ts`)
- **Controllers**: Business logic (`playerController.ts`, `teamController.ts`, `matchController.ts`)
- **Routes**: API endpoints (`playerRoutes.ts`, `teamRoutes.ts`, `matchRoutes.ts`)

**Repository Pattern**
- Database access abstracted through `config/database.ts`
- Centralized query execution
- Connection pooling

### Frontend

**Component-Based Architecture**
- Reusable UI components
- Single responsibility principle
- Separation of concerns

**Service Layer**
- API calls centralized in `services/api.ts`
- Type-safe requests and responses
- Error handling

## Security Considerations

### Current Implementation
- Environment variables for sensitive data
- Input validation on backend
- Type safety with TypeScript
- CORS configuration
- SQL injection prevention (parameterized queries)

### Production Recommendations
- Add authentication (JWT)
- Add authorization (role-based access)
- Rate limiting
- Request validation middleware
- HTTPS enforcement
- Database connection encryption
- API key for frontend-backend communication

## Performance Optimization

### Database
- Indexed primary keys
- Foreign key constraints
- Connection pooling
- Efficient query design

### Frontend
- Code splitting (Vite)
- Lazy loading potential
- Optimized bundle size
- Styled components for scoped CSS

### Backend
- Async operations
- Non-blocking I/O
- Efficient TypeScript compilation

## Scalability Considerations

### Current Limitations
- Single database instance
- No caching layer
- Synchronous match simulation

### Future Enhancements
- Redis for caching
- Queue system for match simulation (Bull, RabbitMQ)
- Database replication
- Horizontal scaling with load balancer
- Microservices architecture
- Real-time updates (WebSocket)

## Development Workflow

### Hot Reload
- Frontend: Vite HMR for instant updates
- Backend: Nodemon for automatic restarts

### Type Safety
- TypeScript on both frontend and backend
- Shared type definitions possible
- Compile-time error detection

### Build Process
- Frontend: Vite build → static files
- Backend: TypeScript compilation → JavaScript

## Testing Strategy (Future)

### Recommended Testing
- **Unit Tests**: Jest for business logic
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for user flows
- **Database Tests**: In-memory PostgreSQL

## Monitoring and Logging (Future)

### Recommendations
- Structured logging (Winston, Pino)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Database query analysis
- API response times

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────┐
│           Load Balancer / CDN           │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼─────┐     ┌────▼──────┐
│  Frontend  │     │  Backend  │
│  (Static)  │     │  Servers  │
│   Nginx    │     │  (PM2)    │
└────────────┘     └─────┬─────┘
                         │
                   ┌─────▼──────┐
                   │ PostgreSQL │
                   │  Cluster   │
                   └────────────┘
```

## Conclusion

This architecture provides a solid foundation for a football manager MVP with room for growth. The separation of concerns, type safety, and RESTful API design make it maintainable and scalable.
