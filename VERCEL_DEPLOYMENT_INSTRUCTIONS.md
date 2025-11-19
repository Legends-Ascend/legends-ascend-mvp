# Vercel Deployment Instructions

## After Merging This PR

This PR fixes the newsletter subscription 404 error by properly configuring Vercel to deploy both the frontend and backend in a single project (monorepo approach).

### What Changed

The root `vercel.json` now correctly configures:
1. Frontend build from `/frontend` directory (static files)
2. Backend API as a serverless function from `/api/index.ts`
3. Proper routing: `/api/*` → backend, everything else → frontend

### Required Actions in Vercel Dashboard

After merging this PR, you need to update your Vercel project settings:

#### 1. Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Add or update these variables:**

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_API_URL` | `/api` | Production, Preview, Development |
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

**Optional variables:**
- `EMAILOCTOPUS_API_KEY` - For newsletter functionality
- `EMAILOCTOPUS_LIST_ID` - For newsletter functionality
- `ALLOWED_ORIGINS` - Set to `*` for testing (can restrict later)

#### 2. Build Settings

Go to: **Vercel Dashboard → Your Project → Settings → General**

**Update these settings:**

| Setting | Value | Notes |
|---------|-------|-------|
| **Root Directory** | `/` (leave empty) | Must be root, not `/frontend` |
| **Build Command** | `pnpm install && pnpm --filter=./frontend run build` | Override if different |
| **Output Directory** | `frontend/dist` | Override if different |
| **Install Command** | `pnpm install` | Override if different |

> **Important**: The `vercel.json` file will automatically handle the `/api` serverless function deployment. You only need to ensure the frontend builds correctly.

#### 3. Redeploy

After updating the environment variables and build settings:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. Or push a new commit to trigger automatic deployment

### Verification

After redeployment, verify the fix:

1. **Check API Health:**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","message":"Legends Ascend API is running"}`

2. **Check Frontend:**
   - Visit `https://your-app.vercel.app`
   - Open browser Developer Console
   - Look for API configuration messages (should show no errors)
   - Navigate to landing page

3. **Test Newsletter Subscription:**
   - Go to landing page
   - Enter email and accept GDPR consent
   - Click "Join the Waitlist"
   - Should see success message (no 404 error)
   - Check browser Network tab - POST to `/api/v1/subscribe` should return 200

### Troubleshooting

#### Still getting 404 errors?

1. **Check environment variables**: Ensure `VITE_API_URL=/api` is set
2. **Check build logs**: Go to Deployments → [Latest] → Building to see if both frontend and API are building
3. **Check function logs**: Go to Deployments → [Latest] → Functions to see if the API function was created
4. **Redeploy**: Sometimes a fresh deployment is needed for changes to take effect

#### API function not showing in Vercel?

1. Verify `vercel.json` is in the repository root
2. Verify `api/index.ts` exists in the repository
3. Check build logs for errors during API function creation

#### CORS errors?

Set `ALLOWED_ORIGINS=*` in environment variables for testing. For production, set to specific domain(s).

#### Database connection errors?

1. Verify `DATABASE_URL` is set correctly
2. Check database is accessible from Vercel
3. For Neon DB, ensure connection pooling is enabled

### Support

For more details, see:
- `DEPLOYMENT.md` - Complete deployment guide
- `MONOREPO_DEPLOYMENT.md` - Monorepo deployment strategy
- Original issue: Newsletter subscription failure

If problems persist:
1. Check Vercel function logs for errors
2. Verify all environment variables are set
3. Try redeploying from a clean state
