# Environment Variables Setup Guide

This guide will help you configure all the necessary environment variables for your mindware-blog project to work properly with GraphQL and Google APIs.

## 🚨 **Current Issues Fixed**

The build was failing due to:

1. **GraphQL Issues**: Missing Hashnode GraphQL configuration
2. **Google API Issues**: Missing Google OAuth and Calendar configuration
3. **Missing Environment Variables**: External services not properly configured

## 📋 **Required Environment Variables**

Create a `.env.local` file in the `packages/blog-starter-kit/themes/enterprise/` directory with the following variables:

### 1. **Hashnode GraphQL Configuration**

```bash
# Required for blog content
NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT=https://gql.hashnode.com/
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
```

### 2. **Google OAuth Configuration**

```bash
# Required for Google Calendar integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback
```

### 3. **Google Calendar Configuration**

```bash
# Required for scheduling functionality
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
```

### 4. **OpenAI Configuration**

```bash
# Required for chatbot functionality
OPENAI_API_KEY=your_openai_api_key
```

### 5. **Feature Flags**

```bash
# Enable/disable features
NEXT_PUBLIC_FEATURE_SCHEDULING=true
NEXT_PUBLIC_FEATURE_CASE_STUDY=true
NEXT_PUBLIC_FEATURE_CLIENT_INTAKE=true
FEATURE_SCHEDULING=true
FEATURE_CASE_STUDY=true
FEATURE_CLIENT_INTAKE=true
```

### 6. **GitHub Configuration (Optional)**

```bash
# For chatbot to fetch articles from GitHub
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=your_articles_repo
GITHUB_TOKEN=your_github_token
```

### 7. **Email Configuration (Optional)**

```bash
# For sending booking confirmations
RESEND_API_KEY=your_resend_api_key
```

### 8. **App Configuration**

```bash
# Base configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MODE=development
```

## 🔧 **Setup Instructions**

### **Step 1: Hashnode GraphQL Setup**

1. **Get your Hashnode publication host**:
   - Go to your Hashnode dashboard
   - Your publication host is in the URL: `https://hashnode.com/p/YOUR_HOST`
   - Example: If your blog is at `https://mindware.hashnode.dev`, then `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev`

2. **GraphQL endpoint** is already set to the default Hashnode endpoint

### **Step 2: Google OAuth Setup**

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**:
   - Enable Google Calendar API
   - Enable Google OAuth2 API

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/google/oauth/callback` (development)
     - `https://your-domain.com/api/google/oauth/callback` (production)

4. **Get Client ID and Secret**:
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local`

### **Step 3: Google Calendar Service Account**

1. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Give it a name like "mindware-blog-calendar"
   - Grant "Calendar API Admin" role

2. **Download Service Account Key**:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key" → "JSON"
   - Download the JSON file

3. **Extract Values**:
   - Open the downloaded JSON file
   - Copy all the values to your `.env.local` file
   - Make sure to escape the private key properly

4. **Share Calendar**:
   - Go to [Google Calendar](https://calendar.google.com)
   - Find your calendar settings
   - Share the calendar with the service account email (from `client_email` in the JSON)

### **Step 4: OpenAI Setup**

1. **Get OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy it to your `.env.local`

### **Step 5: GitHub Setup (Optional)**

1. **Create GitHub Token**:
   - Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
   - Create new token with `repo` scope
   - Add to your `.env.local`

## 🧪 **Testing Your Configuration**

### **Test GraphQL Connection**

```bash
# Start development server
pnpm dev

# Visit these URLs to test:
# http://localhost:3000/api/test-github
# http://localhost:3000/api/test-env
```

### **Test Google Calendar**

1. Open the chatbot on your site
2. Try to schedule a meeting
3. Check if calendar integration works

### **Test OpenAI Chatbot**

1. Open the chatbot
2. Ask a question
3. Verify AI responses work

## 🚨 **Troubleshooting**

### **GraphQL Errors**

- ✅ Check `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` is correct
- ✅ Verify your Hashnode publication exists
- ✅ Check network connectivity

### **Google API Errors**

- ✅ Verify all Google environment variables are set
- ✅ Check service account has calendar access
- ✅ Ensure OAuth redirect URIs are correct

### **Build Errors**

- ✅ All environment variables are in `.env.local`
- ✅ No typos in variable names
- ✅ Private key is properly escaped

## 📊 **GitHub Actions Integration**

For GitHub Actions to work properly, add these secrets to your repository:

### **Required Secrets**

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### **Optional Secrets**

- `NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT`
- `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALENDAR_ID`
- `GITHUB_TOKEN`

## 🎯 **Next Steps**

1. **Create `.env.local`** with all required variables
2. **Test locally** with `pnpm dev`
3. **Add GitHub secrets** for CI/CD
4. **Deploy** and verify everything works

Once configured, your blog will have:

- ✅ Working GraphQL integration with Hashnode
- ✅ Google Calendar scheduling
- ✅ OpenAI-powered chatbot
- ✅ GitHub Actions CI/CD pipeline
- ✅ Automatic deployments to Vercel

Your mindware-blog project will be fully functional with all external integrations working properly! 🚀
