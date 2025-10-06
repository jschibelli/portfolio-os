# Portfolio OS Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting information for common issues encountered with the Portfolio OS system, including development, deployment, and automation problems.

## 📋 **Table of Contents**

1. [Development Issues](#development-issues)
2. [Deployment Problems](#deployment-problems)
3. [Automation Issues](#automation-issues)
4. [Performance Problems](#performance-problems)
5. [Database Issues](#database-issues)
6. [Authentication Problems](#authentication-problems)
7. [Common Solutions](#common-solutions)
8. [Emergency Procedures](#emergency-procedures)

## 🔧 **Development Issues**

### **Build Failures**

#### **Problem**: Build process fails with TypeScript errors
```bash
Error: Type 'string' is not assignable to type 'number'
```

**Solutions:**
1. **Check TypeScript Configuration**
   ```bash
   npx tsc --noEmit
   ```

2. **Clear Cache and Rebuild**
   ```bash
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

3. **Update Dependencies**
   ```bash
   pnpm update
   ```

#### **Problem**: Module not found errors
```bash
Module not found: Can't resolve '@/components/Button'
```

**Solutions:**
1. **Check Import Paths**
   ```typescript
   // Correct
   import { Button } from '@/components/Button';
   
   // Check tsconfig.json paths
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Verify File Structure**
   ```bash
   # Ensure files exist
   ls -la src/components/Button.tsx
   ```

### **Development Server Issues**

#### **Problem**: Development server won't start
```bash
Error: Port 3000 is already in use
```

**Solutions:**
1. **Kill Process on Port**
   ```bash
   # Find process using port
   lsof -ti:3000
   
   # Kill process
   kill -9 $(lsof -ti:3000)
   ```

2. **Use Different Port**
   ```bash
   pnpm dev --port 3001
   ```

3. **Check Environment Variables**
   ```bash
   # Verify .env.local exists
   ls -la .env.local
   
   # Check for syntax errors
   cat .env.local
   ```

#### **Problem**: Hot reload not working
**Solutions:**
1. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   pnpm dev
   ```

2. **Check File Watchers**
   ```bash
   # Increase file watcher limit (Linux/Mac)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

### **Dependency Issues**

#### **Problem**: Package installation fails
```bash
Error: EACCES: permission denied
```

**Solutions:**
1. **Fix Permissions**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Use PNPM**
   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. **Clear Package Manager Cache**
   ```bash
   # PNPM
   pnpm store prune
   
   # NPM
   npm cache clean --force
   ```

## 🚀 **Deployment Problems**

### **Vercel Deployment Issues**

#### **Problem**: Build fails on Vercel
```bash
Build failed: Command "pnpm build" exited with 1
```

**Solutions:**
1. **Check Build Logs**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Review build logs for specific errors

2. **Update Build Command**
   ```json
   // vercel.json
   {
     "buildCommand": "pnpm build",
     "installCommand": "pnpm install"
   }
   ```

3. **Environment Variables**
   - Verify all required env vars are set in Vercel
   - Check for typos in variable names
   - Ensure production values are correct

#### **Problem**: Environment variables not loading
**Solutions:**
1. **Check Vercel Environment Settings**
   - Dashboard → Project → Settings → Environment Variables
   - Ensure variables are set for Production environment

2. **Verify Variable Names**
   ```bash
   # Check in code
   console.log(process.env.NEXT_PUBLIC_API_URL);
   ```

3. **Redeploy After Changes**
   - Environment variable changes require new deployment
   - Trigger redeploy manually if needed

### **Database Connection Issues**

#### **Problem**: Database connection fails
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. **Check Database URL**
   ```bash
   # Verify DATABASE_URL format
   echo $DATABASE_URL
   # Should be: postgresql://user:password@host:port/database
   ```

2. **Test Connection**
   ```bash
   # Using psql
   psql $DATABASE_URL
   
   # Using Prisma
   npx prisma db push
   ```

3. **Check Database Status**
   ```bash
   # For local PostgreSQL
   sudo service postgresql status
   sudo service postgresql start
   ```

## 🤖 **Automation Issues**

### **PowerShell Script Problems**

#### **Problem**: Execution policy prevents script running
```bash
Execution of scripts is disabled on this system
```

**Solutions:**
1. **Set Execution Policy**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Run Script Directly**
   ```powershell
   powershell -ExecutionPolicy Bypass -File script.ps1
   ```

3. **Check Script Permissions**
   ```powershell
   Get-ExecutionPolicy -List
   ```

#### **Problem**: Git commands fail in automation
```bash
fatal: not a git repository
```

**Solutions:**
1. **Check Working Directory**
   ```powershell
   # Ensure you're in project root
   Get-Location
   Set-Location "C:\path\to\portfolio-os"
   ```

2. **Verify Git Repository**
   ```powershell
   git status
   git remote -v
   ```

3. **Check Git Configuration**
   ```powershell
   git config --list
   ```

### **Housekeeping Script Issues**

#### **Problem**: File organization fails
```bash
Move-Item: Cannot create a file when that file already exists
```

**Solutions:**
1. **Check for Conflicts**
   ```powershell
   # List files in target directory
   Get-ChildItem "scripts\utilities" -Name
   ```

2. **Use Force Flag**
   ```powershell
   Move-Item $file.FullName $targetDir -Force
   ```

3. **Backup Before Moving**
   ```powershell
   Copy-Item $file.FullName $backupPath
   Move-Item $file.FullName $targetDir
   ```

## ⚡ **Performance Problems**

### **Slow Loading Times**

#### **Problem**: Site loads slowly
**Solutions:**
1. **Optimize Images**
   ```bash
   # Use Next.js Image component
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     priority
   />
   ```

2. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
   };
   ```

3. **Check Bundle Size**
   ```bash
   pnpm build
   # Review bundle analyzer output
   ```

### **Database Performance**

#### **Problem**: Slow database queries
**Solutions:**
1. **Add Database Indexes**
   ```sql
   CREATE INDEX idx_posts_published_at ON posts(published_at);
   CREATE INDEX idx_projects_status ON projects(status);
   ```

2. **Optimize Queries**
   ```typescript
   // Use select to limit fields
   const projects = await prisma.project.findMany({
     select: {
       id: true,
       title: true,
       description: true,
     },
     where: {
       status: 'published'
     }
   });
   ```

3. **Enable Query Logging**
   ```typescript
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     log      = ["query", "info", "warn", "error"]
   }
   ```

## 🗄️ **Database Issues**

### **Migration Problems**

#### **Problem**: Migration fails
```bash
Error: Migration failed
```

**Solutions:**
1. **Reset Database**
   ```bash
   npx prisma migrate reset
   npx prisma generate
   ```

2. **Check Migration Status**
   ```bash
   npx prisma migrate status
   ```

3. **Manual Migration**
   ```bash
   npx prisma db push
   ```

### **Connection Pool Issues**

#### **Problem**: Too many connections
```bash
Error: too many connections
```

**Solutions:**
1. **Configure Connection Pool**
   ```typescript
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"
   }
   ```

2. **Use Connection Pooling**
   ```bash
   # Add to DATABASE_URL
   postgresql://user:password@host:port/database?connection_limit=5
   ```

## 🔐 **Authentication Problems**

### **Login Issues**

#### **Problem**: Cannot log into dashboard
**Solutions:**
1. **Check Credentials**
   - Verify username and password
   - Check for typos
   - Ensure account is active

2. **Clear Browser Data**
   - Clear cookies and cache
   - Try incognito/private mode
   - Check browser console for errors

3. **Reset Password**
   ```bash
   # Use password reset functionality
   # Or reset in database directly
   ```

### **Session Problems**

#### **Problem**: Session expires too quickly
**Solutions:**
1. **Check Session Configuration**
   ```typescript
   // auth configuration
   const authOptions = {
     session: {
       strategy: 'jwt',
       maxAge: 30 * 24 * 60 * 60, // 30 days
     }
   };
   ```

2. **Implement Refresh Tokens**
   ```typescript
   // Add refresh token logic
   const refreshToken = await generateRefreshToken(userId);
   ```

## 🛠️ **Common Solutions**

### **General Troubleshooting Steps**

1. **Check Logs**
   ```bash
   # Application logs
   tail -f logs/app.log
   
   # System logs
   journalctl -u your-service
   ```

2. **Verify Environment**
   ```bash
   # Check Node.js version
   node --version
   
   # Check PNPM version
   pnpm --version
   
   # Check environment variables
   env | grep -E "(NODE|DATABASE|API)"
   ```

3. **Clear Caches**
   ```bash
   # Clear all caches
   rm -rf .next node_modules .turbo
   pnpm install
   pnpm build
   ```

### **Debugging Tools**

1. **Enable Debug Logging**
   ```bash
   DEBUG=* pnpm dev
   ```

2. **Use Browser DevTools**
   - Network tab for API calls
   - Console for JavaScript errors
   - Performance tab for bottlenecks

3. **Database Debugging**
   ```bash
   # Enable Prisma logging
   npx prisma studio
   ```

## 🚨 **Emergency Procedures**

### **Site Down**

1. **Check Status**
   ```bash
   # Check if site is accessible
   curl -I https://johnschibelli.dev
   
   # Check Vercel status
   # Visit status.vercel.com
   ```

2. **Rollback Deployment**
   - Go to Vercel Dashboard
   - Find last working deployment
   - Click "Promote to Production"

3. **Database Recovery**
   ```bash
   # Restore from backup
   pg_restore -d database_name backup_file.sql
   ```

### **Data Loss**

1. **Check Backups**
   ```bash
   # List available backups
   ls -la backups/
   ```

2. **Restore Data**
   ```bash
   # Restore database
   psql $DATABASE_URL < backup.sql
   ```

3. **Verify Integrity**
   ```bash
   # Check data integrity
   npx prisma db push
   ```

## 📞 **Getting Help**

### **Self-Service Resources**

1. **Documentation**
   - Check this troubleshooting guide
   - Review API documentation
   - Read developer guides

2. **Community Support**
   - GitHub Discussions
   - Stack Overflow
   - Discord/Slack channels

3. **Professional Support**
   - Create GitHub issue
   - Contact development team
   - Schedule consultation

### **Issue Reporting**

When reporting issues, include:
- **Error Messages**: Full error text and stack traces
- **Steps to Reproduce**: Detailed reproduction steps
- **Environment**: OS, Node.js version, browser
- **Logs**: Relevant log files and console output
- **Screenshots**: Visual evidence of the problem

---

**This troubleshooting guide helps resolve common issues and maintain system stability!** 🔧
