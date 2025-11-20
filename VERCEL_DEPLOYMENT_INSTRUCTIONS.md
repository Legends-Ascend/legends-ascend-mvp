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

> **Note**: When using the `builds` configuration in `vercel.json`, Vercel ignores the Build and Development Settings in your Project Settings. The configuration in `vercel.json` takes precedence.

The `vercel.json` file in this repository is now fully configured to handle both frontend and backend builds. No manual build settings configuration is needed in the Vercel dashboard.

**What happens automatically:**
- Frontend builds using `@vercel/static-build` from `frontend/package.json`
- The `vercel-build` script runs: `pnpm run build`
- Build output is in `dist` directory (relative to `frontend/package.json` location)
- Backend API deploys as serverless function from `api/index.ts`
- Routing is configured: `/api/*` → backend, everything else → frontend

> **Important**: The `distDir` in `vercel.json` is `"dist"`, which is relative to the `frontend/package.json` location (not the repository root). This means Vercel looks for `frontend/dist` when deploying the static files.

#### 3. Redeploy

After updating the environment variables:
1. The `vercel.json` configuration will be automatically applied
2. Go to **Deployments** tab
3. Click on the latest deployment
4. Click **"Redeploy"** button
5. Or push a new commit to trigger automatic deployment

> **Note**: You may see a warning during deployment: "Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply." This is expected and correct behavior.

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

#### Build fails with npm/pnpm errors?

**Symptoms:**
- Build log shows: "npm ERR!" or dependency not found errors
- Error occurs after "Installing dependencies" step

**Solution:**
This is fixed in the latest commit. The `vercel-build` script in `frontend/package.json` now uses `pnpm run build` instead of `npm run build`. This ensures the build uses the pnpm workspace dependencies that Vercel installs.

If you still see this error:
1. Ensure you've pulled the latest changes from this PR
2. Check that `frontend/package.json` has `"vercel-build": "pnpm run build"`
3. Redeploy

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
