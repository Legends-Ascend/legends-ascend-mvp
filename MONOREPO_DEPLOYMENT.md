# Monorepo Deployment Guide

## Overview

This guide covers deploying the Legends Ascend MVP as a single Vercel deployment with both frontend and backend.

## Architecture

- **Frontend**: React + Vite (Static files served from `/`)
- **Backend**: Express API (Serverless functions served from `/api/*`)
- **Database**: PostgreSQL (configure via environment variables)

## Changes Made

### 1. Root `vercel.json`
- Configures both frontend build and backend serverless function
- Routes `/api/*` to backend, everything else to frontend

### 2. Backend (`backend/src/index.ts`)
- Modified to support both serverless (Vercel) and traditional deployment
- Exports Express app when `process.env.VERCEL` is set
- Lazy database initialization on first request

### 3. Backend `vercel.json`
- Configures `@vercel/node` for TypeScript serverless functions

## Deployment Steps

### Initial Setup

1. **Go to Vercel Dashboard**
   - Navigate to your existing project (or create new)
   - Settings → General → Root Directory: Leave as `/` (root)

2. **Environment Variables**
   
   Add these in Settings → Environment Variables:
   
   **Required for All Environments:**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```
   
   **For Frontend (VITE_ prefix):**
   ```
   VITE_API_URL=/api
   ```
   ✅ Notice: For monorepo, use `/api` (relative URL) since backend runs in same deployment
   
   **Optional:**
   ```
   ALLOWED_ORIGINS=*
   ```
   (You can restrict this to specific domains later)

3. **Deploy**
   - Push your changes to GitHub
   - Vercel will automatically detect the new configuration and deploy

### What Happens During Deployment

1. Vercel reads the root `vercel.json`
2. Runs build commands for both frontend and backend
3. Creates serverless function from `backend/src/index.ts`
4. Serves static frontend files from `frontend/dist`
5. Routes `/api/*` requests to the backend function

## Testing

### Test Backend API
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
  -d '{"email":"test@example.com","gdprConsent":true,"timestamp":"2025-11-19T12:00:00Z"}'
```

### Test Frontend
1. Visit `https://your-app.vercel.app`
2. Navigate to the landing page
3. Try subscribing with an email
4. Check browser console - no 405 errors should appear

## Troubleshooting

### Issue: "VITE_API_URL is not configured" Warning

**Solution**: In Vercel dashboard:
1. Settings → Environment Variables
2. Add `VITE_API_URL=/api` for Production, Preview, and Development
3. Redeploy

### Issue: CORS Errors

**Solution**: Check `ALLOWED_ORIGINS` environment variable
- For development/testing: Set to `*`
- For production: Set to your frontend domain(s)

### Issue: Database Connection Fails

**Solution**: 
1. Verify `DATABASE_URL` is set correctly
2. Ensure database accepts connections from Vercel IPs
3. Check database service is running

### Issue: 500 Error on API Calls

**Solution**:
1. Check Vercel function logs: Dashboard → Deployments → [Your Deployment] → Function Logs
2. Verify backend environment variables are set
3. Check database migrations are applied

## Local Development

For local development, the backend still runs as a traditional Express server.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

The frontend's Vite proxy (in `frontend/vite.config.ts`) will forward `/api/*` to `http://localhost:3000` automatically.

## Key Differences from Separate Deployments

| Aspect | Monorepo (Single Deploy) | Separate Deploys |
|--------|-------------------------|------------------|
| **VITE_API_URL** | `/api` (relative) | `https://backend.vercel.app/api` (absolute) |
| **CORS** | Not strictly required | Required and must be configured |
| **Deployment** | One project, one domain | Two projects, two domains |
| **Complexity** | Lower (single config) | Higher (coordinate deployments) |
| **Cost** | One project billing | Two project billing |

## Migration to Separate Deployments

If you later want to split into separate deployments:

1. Deploy backend as separate Vercel project
2. Update `VITE_API_URL` to backend's absolute URL
3. Configure CORS on backend with frontend domain
4. Remove backend build/routes from root `vercel.json`

## Additional Resources

- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)
