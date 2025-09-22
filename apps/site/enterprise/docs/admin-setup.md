# Admin Panel Setup Guide

This guide will help you set up the admin panel and connect it to your database for article management.

## Prerequisites

1. **Database Setup**: Make sure your PostgreSQL database is running and accessible
2. **Environment Variables**: Configure your `.env.local` file with the required variables
3. **GitHub Token**: For Hashnode article import functionality

## Environment Variables

Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB

# Authentication
AUTH_SECRET=change_me_to_a_secure_random_string
AUTH_ADMIN_EMAIL=admin@mindware-blog.com
AUTH_ADMIN_PASSWORD=supersecurepassword

# GitHub (for Hashnode import)
GITHUB_TOKEN=your_github_personal_access_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup Steps

### 1. Database Migration

Run the database migration to create the necessary tables:

```bash
npm run prisma:migrate
```

### 2. Create Admin User

Set up the initial admin user:

```bash
npm run setup-admin
```

This will create an admin user with the credentials specified in your environment variables.

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

Navigate to `http://localhost:3000/admin` and log in with your admin credentials.

## Features

### Article Management

- **View Articles**: See all articles in a table or grid view
- **Create Articles**: Create new articles with the built-in editor
- **Edit Articles**: Modify existing articles
- **Delete Articles**: Remove articles from the system
- **Search & Filter**: Find articles by title, content, or tags

### Hashnode Import

1. **Configure GitHub Token**: Make sure your `GITHUB_TOKEN` is set in your environment
2. **Import Articles**: Click the "Import from Hashnode" button in the articles page
3. **Automatic Processing**: The system will fetch articles from your Hashnode GitHub repository and import them

### API Endpoints

The following API endpoints are available for article management:

- `GET /api/admin/articles` - List all articles
- `POST /api/admin/articles` - Create a new article
- `GET /api/admin/articles/[id]` - Get a specific article
- `PUT /api/admin/articles/[id]` - Update an article
- `DELETE /api/admin/articles/[id]` - Delete an article
- `POST /api/admin/articles/import-hashnode` - Import articles from Hashnode

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Check your `DATABASE_URL` in `.env.local`
2. **Authentication Failed**: Ensure your admin user is created with `npm run setup-admin`
3. **Import Failed**: Verify your `GITHUB_TOKEN` has access to your Hashnode repository
4. **Permission Denied**: Make sure your user has the correct role (ADMIN, EDITOR, or AUTHOR)

### Database Schema

The system uses the following main models:

- **User**: Admin users with roles (ADMIN, EDITOR, AUTHOR)
- **Article**: Blog articles with content, metadata, and relationships
- **Tag**: Article tags for categorization
- **ImageAsset**: Cover images and media assets

## Next Steps

1. **Import Your Articles**: Use the Hashnode import feature to bring in your existing content
2. **Create New Content**: Use the article editor to create new blog posts
3. **Customize**: Modify the admin panel UI and functionality as needed
4. **Deploy**: Set up production environment with proper security configurations

## Support

If you encounter any issues, check the console logs for error messages and ensure all environment variables are properly configured.

