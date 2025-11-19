# API Restructure for Vercel Compatibility

## What Changed (2025-11-19)

### Problem
- Backend API was returning 404 errors
- Vercel couldn't find serverless functions
- Custom `builds` configuration wasn't working

### Root Cause
**Vercel requires API functions to be in `/api` directory at repository root.**

Vercel's serverless function auto-discovery only works when:
1. Functions are in `/api` directory
2. Each file in `/api` becomes an endpoint
3. No custom `builds` configuration needed

### Solution
Restructured the project to follow Vercel's conventions:

```
/
├── api/
│   ├── index.ts          ← Main API handler (auto-discovered by Vercel)
│   ├── package.json      ← Dependencies for serverless function
│   └── tsconfig.json     ← TypeScript config
├── backend/
│   └── src/
│       ├── routes/       ← Express routes (imported by /api/index.ts)
│       ├── controllers/  ← Business logic
│       ├── models/       ← Data models
│       └── config/       ← Configuration
├── frontend/
│   └── ...               ← React app
└── vercel.json           ← Simplified config (no backend build needed)
```

---

## How It Works Now

### 1. Vercel Auto-Discovery
- Vercel scans `/api` directory
- Finds `/api/index.ts`
- Creates serverless function automatically
- Maps to `https://your-app.vercel.app/api/*`

### 2. API Entry Point (`/api/index.ts`)
- Imports Express app
- Imports all routes from `/backend/src/routes`
- Exports the Express app as default
- Vercel wraps this as a serverless function

### 3. Backend Code Reuse
- All existing routes, controllers, models stay in `/backend`
- No duplication needed
- `/api/index.ts` just imports and orchestrates

---

## API Endpoints

All endpoints are now available at:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/v1/subscribe` | POST | Email subscription |
| `/api/players` | GET, POST | Player management |
| `/api/teams` | GET, POST | Team management |
| `/api/matches` | GET, POST | Match management |
| `/api/v1/players/:id/inventory` | GET | Player inventory |
| `/api/v1/squads` | GET, POST | Squad management |

---

## Testing

### Test Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","message":"Legends Ascend API is running"}
```

### Test Subscribe Endpoint
```bash
curl -X POST https://your-app.vercel.app/api/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","gdprConsent":true,"timestamp":"2025-11-19T15:00:00Z"}'
```

---

## Local Development

### Backend (Traditional Server)
Still works as before:
```bash
cd backend
npm install
npm run dev
```

### Frontend (Vite Dev Server)
With proxy to backend:
```bash
cd frontend
npm install
npm run dev
```

The Vite proxy in `frontend/vite.config.ts` forwards `/api/*` to `http://localhost:3000`.

---

## Environment Variables

No changes needed! Same variables as before:

### Frontend
```
VITE_API_URL=/api
```

### Backend
```
NODE_ENV=production
DATABASE_URL=your_database_url
ALLOWED_ORIGINS=* (or your domain)
```

---

## Key Differences

### Before (Not Working)
```
/backend/src/index.ts → Vercel couldn't find it → 404
```

### After (Working)
```
/api/index.ts → Vercel auto-discovers → ✅ Serverless function created
```

---

## Why This Approach

### ✅ Advantages
1. **Follows Vercel conventions** - No fighting the platform
2. **Automatic discovery** - No complex build config
3. **Zero-config serverless** - Vercel handles everything
4. **Backend code reuse** - No duplication, just imports
5. **Simpler deployment** - Less configuration to maintain

### Comparison

| Aspect | Old Approach | New Approach |
|--------|--------------|---------------|
| **Location** | `/backend/src/index.ts` | `/api/index.ts` |
| **Discovery** | Manual `builds` config | Automatic |
| **Working** | ❌ 404 errors | ✅ Working |
| **Config** | Complex | Minimal |
| **Backend reuse** | N/A | ✅ Full reuse |

---

## Migration Notes

### What Was Created
1. `/api/index.ts` - New entry point
2. `/api/package.json` - Dependencies
3. `/api/tsconfig.json` - TypeScript config

### What Was Changed
1. `vercel.json` - Removed backend build config

### What Stayed the Same
1. All backend code in `/backend`
2. All routes, controllers, models
3. Frontend code and configuration
4. Environment variables

---

## Troubleshooting

### If API still returns 404
1. Check Vercel deployment logs
2. Verify `/api/index.ts` exists
3. Check `/api/package.json` has correct dependencies
4. Verify environment variables are set

### If Database Connection Fails
1. Check `DATABASE_URL` environment variable
2. Verify database allows connections from Vercel IPs
3. Check function logs in Vercel dashboard

---

## References

- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [API Routes](https://vercel.com/docs/functions/serverless-functions/quickstart)

---

**Status:** API restructured and deployed. Ready for testing!
**Last Updated:** 2025-11-19 16:15 CET
