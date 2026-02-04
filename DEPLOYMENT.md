# 🚀 Deployment Guide - Ayma Advisors

This guide covers deploying your ultra-optimized insurance platform to production.

## 📋 Pre-Deployment Checklist

- [x] Production build verified (50.2 KB Brotli)
- [x] All optimizations enabled (Gzip + Brotli)
- [x] Security headers configured
- [x] PWA manifest ready
- [x] SEO optimized (robots.txt, sitemap.xml)
- [x] Error boundaries implemented
- [x] Performance monitoring (Web Vitals)
- [x] Vercel configuration ready

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Why Vercel?**
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN (300+ locations)
- ✅ Automatic Brotli compression
- ✅ Perfect for React/Vite apps
- ✅ Free tier available

#### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project name? aymaseguros
# - In which directory is your code? ./
# - Want to modify settings? No
```

#### Deploy with Git Integration (Easiest)

1. **Push to GitHub** (if not already done):
   ```bash
   git push origin claude/update-todo-list-01SDGA4p34Km8VieNPA9JaNZ
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the branch: `claude/update-todo-list-01SDGA4p34Km8VieNPA9JaNZ`
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Configure Environment Variables** (if needed):
   - Go to Project Settings → Environment Variables
   - Add Google Analytics ID: `G-XXXXXXXXXX`
   - Add any other secrets

4. **Done!** Your site will be live at:
   ```
   https://aymaseguros.vercel.app
   ```

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Specify:
# - Build command: npm run build
# - Publish directory: dist
```

---

### Option 3: AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

### Option 4: Traditional Hosting (cPanel, etc.)

```bash
# Build the project
npm run build

# Upload contents of dist/ folder to your hosting:
# - Via FTP/SFTP
# - Via cPanel File Manager
# - Via SSH: scp -r dist/* user@host:/path/to/public_html/
```

**Important for traditional hosting:**
- Configure `.htaccess` for SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Google Analytics ID

Replace `G-XXXXXXXXXX` in `index.html` with your actual GA4 ID:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>
<script>
  gtag('config', 'G-YOUR-ACTUAL-ID', {
    'send_page_view': false,
    'anonymize_ip': true
  });
</script>
```

### 2. Update Domain in Files

Update these files with your production domain:

**vercel.json:**
```json
{
  "rewrites": [...]
}
```

**public/sitemap.xml:**
```xml
<loc>https://your-actual-domain.com/</loc>
```

**index.html:**
```html
<link rel="canonical" href="https://your-actual-domain.com/">
<meta property="og:url" content="https://your-actual-domain.com/">
```

### 3. Generate PWA Icons

You need 192x192 and 512x512 icons. Use [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):

```bash
npx pwa-asset-generator public/logo.svg public/ \
  --icon-only \
  --favicon \
  --type png \
  --path-override '/icon'
```

Or manually create:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

### 4. Configure Custom Domain (Vercel)

```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS:
# - Add CNAME: www → cname.vercel-dns.com
# - Add A record: @ → 76.76.21.21
```

---

## 📊 Verify Deployment

### 1. Check Performance

Run Lighthouse audit:
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com \
  --output html \
  --output-path ./lighthouse-report.html
```

**Expected scores:**
- Performance: 98-100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### 2. Verify Compression

```bash
# Check if Brotli is working
curl -H "Accept-Encoding: br" \
  -I https://your-domain.com/assets/js/react-vendor-[hash].js

# Should see: Content-Encoding: br
```

### 3. Check Security Headers

```bash
# Verify security headers
curl -I https://your-domain.com

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

### 4. Test Web Vitals

Open DevTools → Lighthouse → Performance
Check Core Web Vitals:
- ✅ LCP < 2.5s (should be < 1.5s)
- ✅ FID < 100ms
- ✅ CLS < 0.1 (should be < 0.05)

---

## 🔄 Continuous Deployment

### Automatic Deployments (Vercel + GitHub)

Once connected, every push triggers a deployment:

```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm run build
# 3. Deploys to production
# 4. Updates DNS
# 5. Sends deployment notification
```

### Preview Deployments

Every pull request gets a preview URL:
```
https://aymaseguros-git-feature-branch.vercel.app
```

---

## 🚨 Troubleshooting

### Build fails on Vercel

**Problem:** `vite: command not found`

**Solution:** Ensure `package.json` has correct scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 404 on page refresh

**Problem:** Direct URLs return 404

**Solution:** Vercel should handle this automatically with `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Images not loading

**Problem:** Icons/images return 404

**Solution:** Place all static assets in `public/` folder before building.

### Large bundle size warning

**Problem:** Bundle > 500kb warning

**Solution:** Already optimized! Our bundle is only 50kb (Brotli). If you see warnings, check:
```bash
npm run build:analyze
# Opens dist/stats.html to see what's taking space
```

---

## 📈 Monitoring

### 1. Set up Real User Monitoring (RUM)

Web Vitals are already tracked and sent to Google Analytics.

View in GA4:
- Events → Web Vitals
- Category: Web Vitals
- Metrics: LCP, FID, CLS, FCP, TTFB, INP

### 2. Set up Error Tracking (Optional)

Add Sentry for error tracking:

```bash
npm install @sentry/react @sentry/vite-plugin
```

Configure in `src/main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 3. Uptime Monitoring

Free options:
- [UptimeRobot](https://uptimerobot.com) - Free 50 monitors
- [Pingdom](https://pingdom.com) - Free tier available
- [StatusCake](https://statuscake.com) - Free tier

---

## 🎉 Success!

Your ultra-optimized insurance platform is now live!

### Next Steps:

1. **Share the URL** with your team
2. **Test all features** in production
3. **Monitor performance** via GA4
4. **Set up alerts** for downtime
5. **Submit sitemap** to Google Search Console
6. **Add to Bing Webmaster Tools**

### Resources:

- 📊 [Lighthouse Report](https://pagespeed.web.dev/)
- 🔍 [Google Search Console](https://search.google.com/search-console)
- 📈 [Google Analytics](https://analytics.google.com)
- 🚀 [Vercel Dashboard](https://vercel.com/dashboard)

---

**Deployment Time:** ~2-3 minutes
**Global Propagation:** ~5 minutes
**Expected Performance:** 98-100/100 Lighthouse

🎊 **Congratulations on your lightning-fast deployment!** 🎊
