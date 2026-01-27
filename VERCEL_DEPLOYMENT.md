# Deploy Privora 14 to Vercel - Complete Guide

## 🎯 Overview

Deploy your frontend to Vercel for automatic updates from GitHub. Every time you push to GitHub, Vercel will automatically rebuild and deploy your app.

---

## 📋 Prerequisites

1. ✅ GitHub account with your repository
2. ✅ Vercel account (free tier available)
3. ✅ Backend deployed somewhere (Render, Railway, etc.) OR running locally

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. Click "Add New..." → "Project"
2. Find your repository: `mvogonkachristophe0112/privora14`
3. Click "Import"

### Step 3: Configure Build Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `frontend`
- Click "Edit" next to Root Directory
- Enter: `frontend`
- This tells Vercel to build from the frontend folder

**Build Command**: `npm run build` (default, leave as is)

**Output Directory**: `.next` (default, leave as is)

**Install Command**: `npm install` (default, leave as is)

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_API_BASE=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url.onrender.com` with your actual backend URL.

**Options**:
- If backend on Render: `https://privora-backend.onrender.com`
- If backend local: `http://172.20.10.4:3001` (only works on your network)
- If backend on Railway: `https://your-app.railway.app`

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://privora14.vercel.app`

---

## ✅ Automatic Updates from GitHub

### How It Works

```
You push to GitHub → Vercel detects push → Builds automatically → Deploys new version
```

**Timeline**:
1. You: `git push origin master`
2. Vercel: Detects push (instant)
3. Vercel: Builds app (2-3 minutes)
4. Vercel: Deploys to production (instant)
5. Your app: Updated with latest code!

### What Triggers a Deploy

- ✅ Push to `master` branch
- ✅ Merge pull request
- ✅ Direct commit to GitHub

### What Doesn't Trigger a Deploy

- ❌ Local changes not pushed
- ❌ Changes in other branches (unless configured)

---

## 🔧 Configuration Files

### vercel.json (Already Created)

Located at [`frontend/vercel.json`](frontend/vercel.json:1):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_BASE": "@next_public_api_base",
    "NEXT_PUBLIC_BUILD_TIME": "@next_public_build_time",
    "NEXT_PUBLIC_GIT_COMMIT": "@next_public_git_commit"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_BUILD_TIME": "now",
      "NEXT_PUBLIC_GIT_COMMIT": "$VERCEL_GIT_COMMIT_SHA"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/:path((?!_next|api|static).*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

This configuration:
- ✅ Sets correct build directory
- ✅ Injects git commit hash
- ✅ Adds security headers
- ✅ Prevents HTML caching (always fresh)

---

## 🌐 Accessing Your Deployed App

### Production URL

After deployment, you'll get:
- **Production**: `https://privora14.vercel.app`
- **Preview**: `https://privora14-git-master-yourname.vercel.app`

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🔄 Workflow After Deployment

### Making Changes

```bash
# 1. Make changes locally
# Edit files in frontend/

# 2. Test locally
cd frontend
npm run dev
# Visit http://localhost:3000

# 3. Commit and push
git add .
git commit -m "feat: your changes"
git push origin master

# 4. Vercel automatically deploys!
# Check https://vercel.com/dashboard for build status
```

### Verify Deployment

1. **Check Build Status**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click your project
   - See deployment status (Building/Ready)

2. **Check Build Info**
   - Visit: `https://privora14.vercel.app/about`
   - Scroll to bottom
   - Verify commit hash matches GitHub

3. **Test Features**
   - Login/Signup
   - File upload
   - Real-time features

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Module not found"
**Solution**: 
```bash
cd frontend
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push origin master
```

**Error**: "Build exceeded time limit"
**Solution**: 
- Check for infinite loops in code
- Reduce build complexity
- Contact Vercel support for limit increase

### Environment Variables Not Working

**Problem**: API calls fail
**Solution**:
1. Go to Project Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_BASE` is set
3. Click "Redeploy" to apply changes

### Old Version Still Showing

**Problem**: Pushed changes but site shows old version
**Solution**:
1. Check Vercel dashboard - is build complete?
2. Hard refresh browser: `Ctrl + Shift + R`
3. Clear browser cache
4. Check `/about` page for commit hash

---

## 🔐 Environment Variables Guide

### Required Variables

```env
# Backend API URL (REQUIRED)
NEXT_PUBLIC_API_BASE=https://your-backend.onrender.com

# Build info (AUTO-POPULATED by Vercel)
NEXT_PUBLIC_BUILD_TIME=auto
NEXT_PUBLIC_GIT_COMMIT=auto
NEXT_PUBLIC_BUILD_ID=auto
```

### How to Add Variables

1. Go to Project Settings
2. Click "Environment Variables"
3. Add variable name and value
4. Select environments: Production, Preview, Development
5. Click "Save"
6. Redeploy for changes to take effect

---

## 📊 Deployment Comparison

### Local Deployment (Current)

| Aspect | Status |
|--------|--------|
| Cost | ✅ Free |
| Auto-update | ❌ Manual (UPDATE_APP.bat) |
| Accessibility | ❌ Local network only |
| Uptime | ❌ Laptop must be on |
| URL | ❌ IP address (172.20.10.4:3000) |
| SSL/HTTPS | ❌ No |

### Vercel Deployment (Recommended)

| Aspect | Status |
|--------|--------|
| Cost | ✅ Free (hobby plan) |
| Auto-update | ✅ Automatic on git push |
| Accessibility | ✅ Worldwide |
| Uptime | ✅ 99.9% uptime |
| URL | ✅ Custom domain available |
| SSL/HTTPS | ✅ Automatic |

---

## 🎯 Recommended Setup

### Hybrid Approach

**Development** (Local):
- Use local deployment for development
- Fast iteration and testing
- No deployment delays

**Production** (Vercel):
- Deploy to Vercel for production
- Automatic updates from GitHub
- Accessible from anywhere

### Workflow

```bash
# Development
1. Make changes locally
2. Test with: npm run dev
3. Verify everything works

# Production
4. Commit: git add . && git commit -m "..."
5. Push: git push origin master
6. Vercel auto-deploys
7. Verify on: https://privora14.vercel.app/about
```

---

## 🚀 Quick Start Commands

### Initial Setup

```bash
# 1. Ensure latest code is pushed
git add .
git commit -m "prepare for vercel deployment"
git push origin master

# 2. Go to vercel.com and import repository
# 3. Set root directory to: frontend
# 4. Add environment variable: NEXT_PUBLIC_API_BASE
# 5. Deploy!
```

### After Setup

```bash
# Every time you make changes:
git add .
git commit -m "your changes"
git push origin master

# Vercel automatically deploys!
# Check status: https://vercel.com/dashboard
```

---

## 📞 Support

### Vercel Resources

- **Dashboard**: https://vercel.com/dashboard
- **Documentation**: https://vercel.com/docs
- **Support**: https://vercel.com/support

### Common Issues

1. **Build fails**: Check build logs in Vercel dashboard
2. **Environment variables**: Redeploy after adding/changing
3. **Old version**: Hard refresh browser (Ctrl+Shift+R)
4. **API errors**: Verify NEXT_PUBLIC_API_BASE is correct

---

## ✅ Checklist

Before deploying to Vercel:

- [ ] GitHub repository is up to date
- [ ] Backend is deployed and accessible
- [ ] You have backend URL ready
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Root directory set to `frontend`
- [ ] Environment variable `NEXT_PUBLIC_API_BASE` added
- [ ] First deployment successful
- [ ] Tested on production URL
- [ ] Build info shows correct commit on `/about` page

---

## 🎉 Benefits of Vercel Deployment

1. **Automatic Updates**: Push to GitHub → Auto-deploy
2. **No Manual Work**: No need for UPDATE_APP.bat
3. **Global Access**: Available worldwide, not just local network
4. **Fast**: Edge network for quick loading
5. **Free**: Hobby plan is free forever
6. **SSL**: Automatic HTTPS
7. **Preview Deployments**: Test before production
8. **Build Info**: Automatic commit hash injection

---

**Ready to deploy?** Follow Step 1 above and you'll be live in 10 minutes!
