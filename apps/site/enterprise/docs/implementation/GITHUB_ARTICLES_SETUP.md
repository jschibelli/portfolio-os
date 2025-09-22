# GitHub Articles Repository Setup

## 🔗 Connect Chatbot to Your Articles Repository

The chatbot can now fetch and reference articles from your GitHub repository!

### 📋 Required Environment Variables

Add these to your `.env.local` file:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# GitHub Repository Configuration
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-articles-repository-name
GITHUB_TOKEN=your_github_personal_access_token_here
```

### 🚀 Setup Steps

1. **Create GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (for private repos) or `public_repo` (for public repos)
   - Copy the token

2. **Configure Environment Variables:**
   - Create `.env.local` file in the enterprise theme directory
   - Add your GitHub username, repository name, and token
   - Add your OpenAI API key

3. **Repository Structure:**
   Your articles repository should have this structure:

   ```
   your-articles-repo/
   ├── posts/
   │   ├── article-1.md
   │   ├── article-2.md
   │   └── article-3.md
   └── README.md
   ```

4. **Article Format:**
   Each `.md` file should contain your full article content.

### 🎯 How It Works

- The chatbot fetches articles from your GitHub repository
- Includes article titles, content previews, and URLs in responses
- Can reference specific articles when answering questions
- Falls back gracefully if GitHub is unavailable

### 🔧 Alternative Options

**Option 2: Direct File Path**
If your articles are in a local directory, you can modify the `fetchArticlesFromRepo()` function to read from a local path instead of GitHub.

**Option 3: RSS Feed**
You could also point to an RSS feed of your articles if you have one.

### 📝 Example Usage

Once configured, the chatbot can now:

- "What articles have you written about React?"
- "Tell me about your TypeScript articles"
- "What's your latest blog post about?"
- "Can you summarize your article on Next.js performance?"
