#!/bin/bash
# Initialize Production Database for Dashboard

echo "🗄️  Initializing Production Database..."
echo ""

# Get DATABASE_URL from Vercel
echo "📋 Make sure you have DATABASE_URL from Vercel environment variables"
echo ""
echo "Run this command with your production DATABASE_URL:"
echo ""
echo "DATABASE_URL='your-production-postgres-url' pnpm --filter @mindware-blog/db prisma db push"
echo ""
echo "This will create all tables including the User table."
echo ""

# Alternative: Run from Vercel CLI
echo "OR use Vercel CLI:"
echo "vercel env pull .env.production.local"
echo "source .env.production.local"
echo "pnpm --filter @mindware-blog/db prisma db push"

