# Deployment Guide for RoadSense AI Frontend

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository with frontend code
- Vercel account (free at vercel.com)

### Steps

1. **Connect GitHub to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "roadsense-ai" project

2. **Configure Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL_PROD=https://your-backend-api.com
   ```

4. **Deploy**
   - Click Deploy
   - Vercel handles everything automatically
   - Get your live URL

5. **Custom Domain** (Optional)
   - Add your domain in Vercel dashboard
   - Update DNS records
   - SSL certificate auto-configured

## Railway Deployment

### Steps

1. **Connect Repository**
   ```bash
   railway link
   ```

2. **Configure**
   - Set root directory: `frontend`
   - Railway auto-detects Next.js

3. **Deploy**
   ```bash
   railway up
   ```

## Docker Deployment

### Build Image
```bash
docker build -t roadsense-frontend .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  roadsense-frontend
```

### Docker Compose (Full Stack)
```bash
docker-compose up -d
```

## Environment Variables

**Production (.env.production.local)**
```
NEXT_PUBLIC_API_URL=https://roadsense-api.onrender.com
```

**Development (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Performance Optimization

- ✅ Image optimization enabled
- ✅ CSS minification
- ✅ JavaScript splitting
- ✅ Font optimization
- ✅ Dynamic imports
- ✅ Caching headers

## Monitoring

### Error Tracking
Add Sentry (optional):
```bash
npm install @sentry/nextjs
```

### Analytics
- Vercel Analytics auto-enabled
- Monitor Core Web Vitals
- Track user interactions

## Troubleshooting

### API Not Connecting
- Check NEXT_PUBLIC_API_URL environment variable
- Verify backend is running
- Check CORS configuration in backend

### Build Fails
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Check Node version: `node -v` (should be 18+)

### Slow Performance
- Check bundle size: `npm run build`
- Enable image optimization
- Use dynamic imports for large components

## Rollback

### Vercel
- Go to Deployments tab
- Click "Promote to Production" on previous deployment

### Docker
- Use image tags: `docker tag image:latest image:v1.0`
- Rollback: `docker run image:v1.0`
