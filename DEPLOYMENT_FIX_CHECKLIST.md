# Deployment Fix Checklist

## ✅ What Was Fixed (2025-11-19)

### Problem
- Frontend showing 405 errors when trying to subscribe
- `/api/v1/subscribe` was being handled by frontend static server instead of backend
- Console warnings about VITE_API_URL not being configured

### Root Cause
**The `frontend/vercel.json` was conflicting with the root `vercel.json`**, causing Vercel to ignore the monorepo routing configuration.

### Changes Made

1. ✅ **Deleted `frontend/vercel.json`**
   - This file was overriding the root configuration
   - Only the root `vercel.json` should exist for monorepo deployments

2. ✅ **Verified root `vercel.json` is correct**
   - Routes `/api/*` to backend serverless function
   - Routes everything else to frontend static files
   - Includes proper build commands for both frontend and backend

3. ✅ **Verified backend is properly configured for serverless**
   - `backend/src/index.ts` exports Express app when `process.env.VERCEL` is set
   - Database initialization happens on first request
   - CORS configured to allow requests

4. ✅ **Triggered fresh deployment**
   - Created `.vercel-deploy-trigger` file to force Vercel to rebuild

---

## 🔍 What You Need to Verify Now

### 1. Watch Vercel Deployment

1. Go to your Vercel Dashboard → Deployments
2. You should see a new deployment triggered by the latest commits
3. **Watch the build logs** for:
   - ✅ Frontend build succeeding
   - ✅ Backend build succeeding
   - ✅ No errors about missing files or routes

### 2. Test Backend API Directly

Once deployment completes, test these endpoints:

#### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"Legends Ascend API is running"}
```

#### Subscribe Endpoint
```bash
curl -X POST https://your-app.vercel.app/api/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","gdprConsent":true,"timestamp":"2025-11-19T13:00:00Z"}'
```

**Expected Response (if database is configured):**
```json
{"success":true,"message":"Successfully subscribed!"}
```

**Or (if database connection issue):**
```json
{"success":false,"message":"Service temporarily unavailable"}
```

### 3. Test Frontend Landing Page

1. Visit `https://your-app.vercel.app`
2. Navigate to the landing page
3. Open browser Developer Tools → Console
4. Try subscribing with an email

**What Should Happen:**
- ✅ No warnings about VITE_API_URL
- ✅ No 405 errors
- ✅ Either success message or proper error from backend

---

## 🚨 If Issues Persist

### Issue: Still Getting 405 Errors

**Check:**
1. Verify deployment finished successfully
2. Check Vercel build logs for errors
3. Verify no `frontend/vercel.json` exists (should be deleted)
4. Check Function logs in Vercel Dashboard

### Issue: "Service temporarily unavailable"

**Check:**
1. Environment variables in Vercel:
   - `DATABASE_URL` or your Neon DB variable
   - `NODE_ENV=production`
2. Database connection from Vercel IPs is allowed
3. Check Function logs for database connection errors

### Issue: CORS Errors

**Check:**
1. `ALLOWED_ORIGINS` environment variable
2. For testing, you can set it to `*`
3. For production, set it to your actual domain(s)

---

## 📊 Expected Environment Variables

Make sure these are set in Vercel → Settings → Environment Variables:

### Required
```
VITE_API_URL=/api
NODE_ENV=production
DATABASE_URL=postgresql://... (or your LA_DATABASE_URL)
```

### Optional
```
ALLOWED_ORIGINS=* (for testing) or https://your-domain.com (for production)
```

---

## 📝 Quick Test Commands

Replace `your-app.vercel.app` with your actual Vercel URL:

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test subscribe endpoint
curl -X POST https://your-app.vercel.app/api/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","gdprConsent":true,"timestamp":"2025-11-19T13:00:00Z"}'

# Test OPTIONS (CORS preflight)
curl -X OPTIONS https://your-app.vercel.app/api/v1/subscribe \
  -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

---

## ✅ Success Criteria

- [ ] Vercel deployment completes successfully
- [ ] `/api/health` returns 200 OK with JSON response
- [ ] Frontend loads without VITE_API_URL warnings
- [ ] Email signup form submits without 405 errors
- [ ] Either success or proper backend error (not 405)

---

## 📚 Additional Resources

- See `MONOREPO_DEPLOYMENT.md` for comprehensive deployment guide
- Check Vercel docs: https://vercel.com/docs/monorepos
- Node.js functions: https://vercel.com/docs/functions/serverless-functions/runtimes/node-js

---

**Last Updated:** 2025-11-19 13:22 CET
**Status:** Configuration fixed, awaiting deployment verification
