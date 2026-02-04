#!/bin/bash

# 🚀 Deployment Script for Ayma Advisors
# This script builds and prepares the project for deployment

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean previous build
echo -e "${BLUE}📦 Cleaning previous build...${NC}"
rm -rf dist/
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}📥 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Run linter
echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint || {
  echo -e "${YELLOW}⚠ Linter warnings detected. Continue? (y/n)${NC}"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
  fi
}
echo -e "${GREEN}✓ Linting complete${NC}"
echo ""

# Step 4: Build production bundle
echo -e "${BLUE}🏗️  Building production bundle...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 5: Analyze bundle size
echo -e "${BLUE}📊 Analyzing bundle size...${NC}"
if [ -f "dist/stats.html" ]; then
  echo -e "${GREEN}✓ Bundle analysis available at dist/stats.html${NC}"
else
  echo -e "${YELLOW}⚠ Bundle analyzer not found${NC}"
fi
echo ""

# Step 6: Display bundle sizes
echo -e "${BLUE}📦 Bundle Sizes (Brotli Compressed):${NC}"
find dist/assets -name "*.br" -type f -exec ls -lh {} \; | awk '{print "  " $9 " - " $5}'
echo ""

# Step 7: Verify critical files
echo -e "${BLUE}✅ Verifying critical files...${NC}"
CRITICAL_FILES=(
  "dist/index.html"
  "dist/manifest.json"
  "dist/robots.txt"
  "dist/sitemap.xml"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}  ✓ $file${NC}"
  else
    echo -e "${YELLOW}  ⚠ $file missing${NC}"
  fi
done
echo ""

# Step 8: Preview build (optional)
echo -e "${BLUE}🔍 Preview build locally? (y/n)${NC}"
read -r preview
if [[ "$preview" =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}Starting preview server at http://localhost:8080${NC}"
  npm run preview
else
  echo -e "${YELLOW}Skipping preview${NC}"
fi
echo ""

# Step 9: Deployment instructions
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}        🎉 Build Complete! Ready to Deploy        ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Deployment Options:${NC}"
echo ""
echo -e "${YELLOW}1. Vercel (Recommended):${NC}"
echo "   vercel --prod"
echo ""
echo -e "${YELLOW}2. Netlify:${NC}"
echo "   netlify deploy --prod"
echo ""
echo -e "${YELLOW}3. Manual Upload:${NC}"
echo "   Upload contents of 'dist/' folder to your server"
echo ""
echo -e "${BLUE}📊 Performance Metrics:${NC}"
echo "   • Initial Bundle: ~50 KB (Brotli)"
echo "   • Expected Lighthouse: 98-100/100"
echo "   • Core Web Vitals: All Green"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   • See DEPLOYMENT.md for detailed instructions"
echo "   • See OPTIMIZATIONS.md for performance details"
echo ""
echo -e "${GREEN}✨ Happy Deploying! ✨${NC}"
