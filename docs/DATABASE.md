# Database Configuration & Management

## Overview

Legends Ascend uses **Neon Serverless PostgreSQL** integrated with Vercel for reliable, scalable database management with automatic preview branching.

**Current Configuration:**
- **Database Name:** `legends-ascend-db`
- **Provider:** Neon (Vercel Marketplace Integration)
- **Plan:** Free Tier (191.9 compute hours/month)
- **Status:** ✅ Production Ready
- **Last Updated:** November 17, 2025

---

## Architecture

### Environment Isolation

The database uses **automatic branching** to isolate environments:

```
┌─ Production (main branch)
│  └─ legends-ascend-db (main)
│     └─ Live data, production traffic
│
├─ Preview Deployments (feature branches)
│  ├─ preview/feat/us-012-lineup
│  ├─ preview/feat/us-003-gacha
│  └─ (created automatically per PR)
│     └─ Isolated copy of production schema
│     └─ Fresh data for each preview
│     └─ Deleted when PR closes
│
└─ Development (local)
   └─ Developer's local Neon branch
      └─ Development credentials
```

### Connection Methods

**Production (Vercel):**
- Connection string: `LA_POSTGRES_URL` (marked sensitive)
- Injected by Vercel automatically
- Environment: All Environments (Production preference)
- Pool: Connection pooling enabled

**Preview Deployments:**
- Connection string: Auto-injected via Neon webhook
- NOT visible in Vercel UI (security best practice)
- Environment: Isolated per preview deployment
- Lifetime: Exists while PR is open

**Local Development:**
- Create `.env` file: `cp .env.example .env`
- Add Neon connection string from Neon Console
- Free tier branch shared among developers

---

## Vercel Integration Settings

### Verified Configuration

The following settings have been configured in Vercel Storage:

✅ **Environments:** Development, Preview, Production  
✅ **Resource Active Requirement:** ON (wait for DB before deploy)  
✅ **Create Database Branches:** Preview ✅ | Production ✅  
✅ **Custom Prefix:** LA  
✅ **Preview Branching:** Enabled for automatic isolation  

### Environment Variables

The following variables are automatically injected:

| Variable | Scope | Usage | Visibility |
|----------|-------|-------|------------|
| `LA_POSTGRES_URL` | All | Connection string (pooled) | Hidden (Sensitive) |
| `LA_POSTGRES_HOST` | All | Database host | Hidden |
| `LA_POSTGRES_PORT` | All | Connection port (5432) | Hidden |
| `LA_POSTGRES_DB` | All | Database name | Hidden |
| `LA_POSTGRES_USER` | All | Database user | Hidden |
| `LA_POSTGRES_PASSWORD` | All | Database password | Hidden |

**Preview-only variables** (injected at deploy time, NOT in Vercel UI):
- For preview deployments, different connection strings are injected via webhook
- These variables are created dynamically and not stored in Vercel

---

## Database Schemas & Tables

### Sprint 1-2 (Weeks 1-4) - Foundation

**Required Tables:**

```sql
-- Players/Cards
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  player_id INTEGER NOT NULL,
  rarity INTEGER NOT NULL (1-5),
  overall_rating INTEGER NOT NULL (40-99),
  stats JSONB NOT NULL (pace, shooting, passing, dribbling, defense, physical),
  tier INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Squads/Teams
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  formation VARCHAR(10) NOT NULL DEFAULT '4-3-3',
  team_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Squad Positions (11 starters + 7 bench)
CREATE TABLE squad_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES squads(id),
  player_id UUID NOT NULL REFERENCES players(id),
  position INTEGER NOT NULL (0-17, where 0-10 are starters, 11-17 are bench),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory/Collections
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  player_id UUID NOT NULL REFERENCES players(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gacha Pull History
CREATE TABLE gacha_pulls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  player_id UUID NOT NULL REFERENCES players(id),
  rarity_received INTEGER NOT NULL,
  pull_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pity_counter INTEGER NOT NULL
);
```

### Sprint 3-4 (Weeks 5-8) - Match System

**Additional Tables:**

```sql
-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_user_id UUID NOT NULL REFERENCES users(id),
  away_user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, simulating, completed
  home_score INTEGER,
  away_score INTEGER,
  match_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match Results
CREATE TABLE match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) UNIQUE,
  home_squad_id UUID NOT NULL REFERENCES squads(id),
  away_squad_id UUID NOT NULL REFERENCES squads(id),
  events JSONB NOT NULL, -- goals, cards, substitutions
  match_data JSONB NOT NULL, -- detailed statistics
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Development Workflow

### Local Development Setup

1. **Create free Neon account:** https://console.neon.tech/signup
2. **Create development branch:** `neonctl branches create`
3. **Get connection string:** Copy from Neon Console
4. **Setup .env file:**
   ```bash
   cp .env.example .env
   # Add your connection string to DATABASE_URL
   ```
5. **Run migrations:** (when available)
   ```bash
   npm run db:migrate:dev
   ```

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feat/us-012-lineup

# 2. Make changes, commit
git commit -m "feat(us-012): Set up casual lineup"

# 3. Push to GitHub
git push origin feat/us-012-lineup

# ✨ Automatic Actions (Neon + Vercel):
# - Vercel creates preview deployment
# - Neon creates: preview/feat/us-012-lineup branch
# - Preview gets isolated database copy
# - Test safely without affecting production

# 4. Open PR, get review, merge
git checkout main
git pull
git merge feat/us-012-lineup

# ✨ After Merge:
# - Vercel deploys to production
# - Neon deletes: preview/feat/us-012-lineup
# - Production continues with main database
```

---

## Monitoring & Maintenance

### Viewing Database Status

**Vercel Dashboard:**
- Go to Project → Storage → `legends-ascend-db`
- View: Plan, compute usage, connections, branches

**Neon Console:**
- Go to https://console.neon.tech
- View: Active branches, compute hours, backups, activity logs
- Manage: Connection pooling, IP whitelisting, roles

### Compute Hours Tracking

**Free Tier:** 191.9 compute hours/month

- Development: ~5-10 hours/day (local testing)
- Preview deployments: ~1-5 hours/day (testing)
- Production: Variable (scale-to-zero during idle)

**Upgrade Path:** $19/month (Launch plan) at 750 hours/month

### Cost Optimization

✅ Scale-to-zero during idle time  
✅ Connection pooling reduces compute waste  
✅ Preview branches deleted automatically  
✅ Monitor monthly usage in Neon dashboard  

---

## Troubleshooting

### Preview branch not appearing in Neon Console

**Symptoms:** PR deployed but no `preview/<branch>` in Neon branches list

**Solutions:**
1. Check Vercel deployment status (click Deployments tab)
2. Verify deployment succeeded (not just preview creation)
3. Wait 30 seconds - Neon webhook may be processing
4. Check Neon integration is enabled in Vercel Storage settings

### Connection pooling errors

**Symptoms:** `Too many connections` or `connection pool exhausted`

**Solutions:**
1. Use `LA_POSTGRES_URL` (pooled connection)
2. Avoid `LA_POSTGRES_URL_UNPOOLED` in serverless functions
3. Use connection pooling for all serverless functions

### Preview and Production using same data

**Should never happen** with correct configuration.

**If it does:**
1. Verify "Create Database Branch For Deployment: Preview" is ✅ in Vercel Storage
2. Contact Neon support

---

## Related Documentation

- [SETUP.md](./SETUP.md) - Local development setup
- [GAME_SYSTEMS_SPECIFICATION.md](./GAME_SYSTEMS_SPECIFICATION.md) - Database schema requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture overview
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) - Git workflow documentation

---

## Future Considerations

### Phase 2 (MVP+ Launch)
- Monitor compute usage, upgrade to Launch plan if needed
- Consider data backup strategy
- Implement automated schema migrations

### Phase 3 (Full Release)
- Scale plan ($69/month) for production traffic
- Add read replicas for scaling
- Implement advanced monitoring and alerting

### Phase 4 (Post-Launch)
- Consider moving to managed database if traffic exceeds Neon capacity
- Implement data archiving strategy
- Advanced performance tuning
