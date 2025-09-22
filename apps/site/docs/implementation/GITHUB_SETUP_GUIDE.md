# GitHub Articles Integration Setup Guide

## 🔧 **Environment Variables Setup**

Create or update your `.env.local` file in the enterprise theme directory with:

```bash
# GitHub Repository Configuration
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-articles-repository
GITHUB_TOKEN=your-github-personal-access-token

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
```

## 📋 **Step-by-Step Setup**

### 1. **Get Your GitHub Username**

- Go to your GitHub profile
- Your username is in the URL: `https://github.com/YOUR_USERNAME`
- **Example**: If your profile is `https://github.com/jschibelli`, then `GITHUB_REPO_OWNER=jschibelli`

### 2. **Create or Identify Your Articles Repository**

- Create a new repository for your articles, or use an existing one
- **Repository name**: `GITHUB_REPO_NAME=your-repo-name`
- **Example**: `GITHUB_REPO_NAME=blog-articles`

### 3. **Generate GitHub Personal Access Token**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Blog Articles Access"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read user profile data)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Set `GITHUB_TOKEN=your-token-here`

### 4. **Repository Structure**

Your repository should have one of these structures:

```
Option 1: Root level markdown files
your-repo/
├── article-1.md
├── article-2.md
└── article-3.md

Option 2: Articles in a subdirectory
your-repo/
├── posts/
│   ├── article-1.md
│   ├── article-2.md
│   └── article-3.md

Option 3: Articles in content directory
your-repo/
├── content/
│   ├── article-1.md
│   ├── article-2.md
│   └── article-3.md
```

## 🧪 **Testing the Integration**

### 1. **Test GitHub Configuration**

Visit: `http://localhost:3000/api/test-github`

Expected response:

```json
{
	"success": true,
	"config": {
		"repoOwner": "your-username",
		"repoName": "your-repo-name",
		"hasToken": true,
		"tokenLength": 40,
		"tokenPreview": "ghp_123456..."
	}
}
```

### 2. **Test Article Fetching**

1. Open the chatbot
2. Ask: "What articles have you written about React?"
3. Check the browser console for debug messages
4. Look for messages like:
   - `🔍 Debug - Trying path: posts`
   - `✅ Found articles in path: posts`
   - `✅ Added article: article-name.md`

## 🔍 **Troubleshooting**

### **404 Error - Repository Not Found**

- ✅ Check `GITHUB_REPO_OWNER` is your GitHub username (not email)
- ✅ Check `GITHUB_REPO_NAME` matches your repository name exactly
- ✅ Ensure the repository exists and is accessible

### **401 Error - Unauthorized**

- ✅ Check `GITHUB_TOKEN` is correct
- ✅ Ensure token has `repo` scope
- ✅ Token might be expired - generate a new one

### **No Articles Found**

- ✅ Check repository structure matches one of the options above
- ✅ Ensure files have `.md` or `.markdown` extension
- ✅ Check browser console for debug messages

### **Wrong Articles Loading**

- ✅ Check file names and content
- ✅ Ensure articles are in the correct directory
- ✅ Verify markdown files are properly formatted

## 📝 **Example .env.local**

```bash
# GitHub Configuration
GITHUB_REPO_OWNER=jschibelli
GITHUB_REPO_NAME=blog-articles
GITHUB_TOKEN=ghp_1234567890abcdef1234567890abcdef12345678

# OpenAI Configuration
OPENAI_API_KEY=sk-1234567890abcdef1234567890abcdef1234567890abcdef
```

## 🚀 **Next Steps**

1. **Update your `.env.local`** with correct values
2. **Restart the development server**: `npm run dev`
3. **Test the integration** using the steps above
4. **Check browser console** for debug messages
5. **Ask the chatbot** about your articles

## 📞 **Need Help?**

If you're still having issues:

1. Check the browser console for error messages
2. Verify your GitHub token has the correct permissions
3. Ensure your repository structure matches the examples above
4. Test the GitHub API directly: `https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents`
