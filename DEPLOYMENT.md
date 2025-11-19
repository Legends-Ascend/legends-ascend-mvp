# Deployment Guide

This document outlines the deployment process for the Legends Ascend MVP, including frontend and backend deployment configurations.

## Architecture Overview

The application consists of two separate deployable components:

1. **Frontend**: React + Vite SPA (deployed to Vercel or similar)
2. **Backend**: Express API (deployed to Vercel, Railway, Render, or similar)

**Important**: The frontend and backend are deployed separately. The frontend makes HTTP requests to the backend API.

## Prerequisites

- [ ] Node.js LTS (v20.x)
- [ ] npm or pnpm package manager
- [ ] Vercel account (or alternative hosting provider)
- [ ] Backend hosting account
- [ ] EmailOctopus API credentials (for waitlist functionality)

## Backend Deployment

### Environment Variables

The backend requires the following environment variables:

```bash
# Database
LA_POSTGRES_URL=postgresql://user:password@host:5432/database
# or
DATABASE_URL=postgresql://user:password@host:5432/database

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration (REQUIRED for production)
# Comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://www.your-domain.com

# EmailOctopus API (Required for US-001 landing page)
EMAILOCTOPUS_API_KEY=your_api_key_here
EMAILOCTOPUS_LIST_ID=your_list_id_here
```

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy backend:
   ```bash
   cd backend
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all required variables listed above

4. Note the backend URL (e.g., `https://your-backend.vercel.app`)

### Alternative Hosting (Railway, Render, etc.)

Follow your hosting provider's documentation for Node.js deployments. Ensure all environment variables are configured.

## Frontend Deployment

### Environment Variables

The frontend **MUST** have the following environment variable configured:

```bash
# REQUIRED: Full URL to your deployed backend API
VITE_API_URL=https://your-backend.vercel.app/api

# Optional: Landing page feature flag
VITE_LANDING_PAGE_ENABLED=true
```

**Critical**: Without a valid `VITE_API_URL`, the subscription API will fail with a 405 error.

### Vercel Deployment

1. **Configure environment variables in Vercel dashboard**:
   - Go to your project in Vercel dashboard (https://vercel.com)
   - Click on your project
   - Go to Settings tab
   - Click on "Environment Variables" in the left sidebar
   - Add a new variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Your backend URL (e.g., `https://legends-ascend-backend.vercel.app/api`)
     - **Environments**: Select Production, Preview, and Development
   - Click "Save"

2. Deploy frontend:
   ```bash
   cd frontend
   vercel --prod
   ```

3. The frontend will be available at your Vercel domain

**Note**: Do NOT use the `@secret_name` syntax in `vercel.json`. Environment variables should be set directly in the Vercel dashboard as regular environment variables, not as references to Vercel Secrets.

### Vercel Configuration

The `frontend/vercel.json` file is pre-configured for SPA routing:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

**Important**: Environment variables like `VITE_API_URL` must be set in the Vercel dashboard under Project Settings > Environment Variables, not in `vercel.json`.

## Troubleshooting

### Issue: Subscription API returns 405 error

**Symptoms**:
- Form submission fails
- Browser console shows: `POST https://your-frontend.vercel.app/api/v1/subscribe net::ERR_ABORTED 405 (Method Not Allowed)`
- Error message: "The subscription service is not configured correctly"
- Console shows detailed configuration error with deployment steps

**Root Cause**:
The frontend is trying to call the API on its own domain instead of the backend API domain. This happens when `VITE_API_URL` is not set during the frontend build.

**Solution** (REQUIRED for production):

1. **Deploy your backend first**:
   ```bash
   cd backend
   vercel --prod
   # Note the URL: https://your-backend-abc123.vercel.app
   ```

2. **Set environment variable in Vercel dashboard** (this is the critical step):
   - Go to https://vercel.com/dashboard
   - Select your **FRONTEND** project (not backend)
   - Go to Settings → Environment Variables
   - Click "Add New"
   - Set:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-backend-abc123.vercel.app/api` (your actual backend URL)
     - **Environment**: Check all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy your frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```
   Or trigger a redeploy in the Vercel dashboard

4. **Verify the fix**:
   - Open your frontend in a browser
   - Open Developer Console
   - Look for the startup log message showing API URL
   - Submit the form and check Network tab - request should go to your backend domain

**Common Mistakes**:
- ❌ Setting `VITE_API_URL` to the frontend URL instead of backend URL
- ❌ Not redeploying after setting the environment variable
- ❌ Setting the variable in the backend project instead of frontend project
- ❌ Forgetting the `/api` suffix in the URL

### Issue: CORS errors

**Symptoms**:
- Browser console shows CORS policy errors
- Requests are blocked before reaching the backend

**Solution**:
1. Update backend `ALLOWED_ORIGINS` environment variable
2. Include all frontend domains (with and without www)
3. Ensure no trailing slashes in origins
4. Redeploy backend after changing environment variables

### Issue: Database connection errors

**Symptoms**:
- 500 errors from API
- Backend logs show database connection failures

**Solution**:
1. Verify `LA_POSTGRES_URL` or `DATABASE_URL` is set correctly
2. Check database credentials and network access
3. For Vercel + Neon: ensure connection pooling is enabled

## Testing Deployment

After deployment, verify the following:

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.vercel.app/api/health
   # Expected: {"status":"ok","message":"Legends Ascend API is running"}
   ```

2. **Frontend Access**:
   - Open `https://your-frontend.vercel.app`
   - Verify landing page loads
   - Check browser console for errors

3. **Subscription Flow**:
   - Submit the "Join Waitlist" form
   - Verify success message appears
   - Check EmailOctopus dashboard for new subscriber
   - Check browser network tab for successful POST to `/api/v1/subscribe`

4. **CORS Verification**:
   - Open browser developer tools > Network tab
   - Submit form and verify:
     - OPTIONS preflight request succeeds (204 status)
     - POST request succeeds (200 status)
     - No CORS errors in console

## Monitoring

### Backend Logs

View backend logs in your hosting provider's dashboard:
- Vercel: Project > Deployments > [Latest] > Runtime Logs
- Railway: Project > Deployments > Logs
- Render: Dashboard > Logs

### Frontend Errors

Monitor frontend errors:
- Use Vercel Analytics (if enabled)
- Check browser console in production
- Implement error tracking (Sentry, LogRocket, etc.)

## Rollback Procedure

If deployment issues occur:

1. **Vercel**: 
   - Go to Deployments tab
   - Find last working deployment
   - Click "Promote to Production"

2. **Environment Variables**:
   - Changes take effect on next deployment
   - Redeploy to apply changes

## Security Checklist

Before going to production:

- [ ] `NODE_ENV=production` set on backend
- [ ] HTTPS enabled on both frontend and backend
- [ ] `ALLOWED_ORIGINS` configured with production domains only
- [ ] EmailOctopus API key is valid and rate limits understood
- [ ] Database credentials are secure and not hardcoded
- [ ] All sensitive environment variables are in hosting provider dashboard, not in code
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled on API endpoints

## Next Steps

After successful deployment:

1. Configure custom domain (optional)
2. Set up SSL certificates (usually automatic with Vercel)
3. Configure monitoring and alerting
4. Set up CI/CD for automatic deployments
5. Test all user flows in production environment

## Support

For deployment issues:
- Check this guide's troubleshooting section
- Review backend logs for errors
- Verify all environment variables are set correctly
- Test API endpoints independently of frontend
- Contact team lead or DevOps support
