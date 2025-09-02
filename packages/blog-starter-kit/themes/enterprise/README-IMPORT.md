# 🚀 Quick Start: Import Hashnode Articles

This guide will help you quickly import your articles from the [hashnode-schibelli](https://github.com/jschibelli/hashnode-schibelli) repository.

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install @octokit/rest remark remark-html remark-gfm tsx
```

### 2. Get GitHub Token
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select `repo` scope (for private repos) or `public_repo` (for public repos)
4. Copy the token

### 3. Add to Environment
Create `.env.local` file:
```env
GITHUB_TOKEN=ghp_your_token_here
DATABASE_URL="your_database_connection_string"
```

### 4. Test Setup
```bash
npm run db:test-import
```

### 5. Run Import
```bash
npm run db:import-hashnode
```

## 📋 What You'll Get

- ✅ All your Hashnode articles imported
- ✅ Automatic tag generation
- ✅ SEO-friendly slugs and excerpts
- ✅ Reading time calculations
- ✅ Proper database relationships

## 🔍 Check Results

Visit `/admin/articles` to see your imported articles in the admin dashboard!

## 📚 Full Documentation

See [docs/import-hashnode-articles.md](docs/import-hashnode-articles.md) for detailed instructions and troubleshooting.

## 🆘 Need Help?

1. Run `npm run db:test-import` to check your setup
2. Check the console output for error messages
3. Verify your GitHub token has correct permissions
4. Ensure your database is running and accessible

---

**Happy importing! 🎉**
