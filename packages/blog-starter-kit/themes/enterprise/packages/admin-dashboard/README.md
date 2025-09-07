# Admin Dashboard

A full-control blog administration system built with Next.js 15, featuring content management, rich text editing, and publishing workflows.

## Features

- **Content Management**: Create, edit, and manage blog articles
- **Rich Text Editor**: Tiptap-based editor with markdown support
- **Role-Based Access**: Admin, Editor, and Author roles
- **Publishing Workflow**: Draft, Scheduled, and Published states
- **Media Management**: Upload and manage images and assets
- **Analytics Dashboard**: KPIs and metrics overview
- **SEO Tools**: Meta tags, Open Graph, and canonical URLs
- **RSS Feed**: Automatic RSS generation for syndication

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + PostgreSQL
- **Authentication**: NextAuth.js with Credentials provider
- **Editor**: Tiptap with rich text extensions
- **UI Components**: Tailwind CSS + shadcn/ui
- **Tables**: TanStack Table for data display
- **Charts**: Tremor for analytics visualization

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Environment variables configured

## Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
   AUTH_SECRET=your-secret-key-here
   AUTH_ADMIN_EMAIL=admin@example.com
   AUTH_ADMIN_PASSWORD=secure-password
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   REVALIDATE_SECRET=your-revalidate-secret
   ```

3. **Set up the database**:
   ```bash
   # Push the schema to your database
   pnpm prisma:push
   
   # Or run migrations
   pnpm prisma:migrate
   
   # Seed the database with admin user
   pnpm prisma:seed
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

The admin dashboard will be available at `http://localhost:3001`.

## Usage

### First Time Setup

1. Navigate to `/login` and sign in with the credentials from your environment variables
2. You'll be redirected to the admin dashboard
3. Create your first article using the "Create Article" button

### Creating Articles

1. Go to `/admin/articles/new`
2. Fill in the article metadata (title, slug, excerpt, etc.)
3. Use the rich text editor to write your content
4. Choose the publication status (Draft, Scheduled, or Published)
5. Save the article

### Managing Articles

- View all articles at `/admin/articles`
- Edit existing articles by clicking the "Edit" button
- Delete articles (with confirmation)
- Filter and search through articles
- Sort by various criteria

### Publishing Workflow

- **Draft**: Work in progress, not visible to the public
- **Scheduled**: Set to publish at a specific date/time
- **Published**: Live and visible on the public blog

### Media Management

- Upload images and other assets
- Organize media in the media library
- Use media in articles with the editor

## API Endpoints

### Articles
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article
- `GET /api/articles/[id]` - Get article
- `PATCH /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Publishing
- `POST /api/scheduler/publish` - Publish scheduled articles (cron job)
- `POST /api/revalidate` - Revalidate Next.js pages

### Media
- `POST /api/upload` - Upload media files
- `GET /api/upload?fileId=[id]` - Get media file info

## Cron Jobs

Set up a cron job to hit `/api/scheduler/publish` to automatically publish scheduled articles:

```bash
# Example cron job (runs every hour)
0 * * * * curl -X POST http://your-domain.com/api/scheduler/publish
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Secret for NextAuth.js | Yes |
| `AUTH_ADMIN_EMAIL` | Admin user email | Yes |
| `AUTH_ADMIN_PASSWORD` | Admin user password | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | Yes |
| `REVALIDATE_SECRET` | Secret for page revalidation | No |

## Database Schema

The system includes models for:
- Users (with role-based access)
- Articles (with content and metadata)
- Tags and Series for organization
- Media assets
- Article versions and reactions

## Customization

### Adding New Editor Extensions

The Tiptap editor can be extended with additional extensions:

```tsx
import { useEditor } from "@tiptap/react";
import YourExtension from "@tiptap/extension-your-extension";

const editor = useEditor({
  extensions: [
    StarterKit,
    YourExtension,
    // ... other extensions
  ],
});
```

### Custom Article Fields

Add new fields to the Article model in `prisma/schema.prisma` and update the forms accordingly.

### Styling

The dashboard uses Tailwind CSS with shadcn/ui components. Customize the design by modifying the Tailwind configuration and component styles.

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `pnpm build`
2. Start the production server: `pnpm start`
3. Set up environment variables
4. Configure your database connection

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure your PostgreSQL database is running and accessible
2. **Authentication**: Check that `AUTH_SECRET` is set and unique
3. **Editor Issues**: Clear browser cache if the Tiptap editor doesn't load
4. **Build Errors**: Ensure all dependencies are installed with `pnpm install`

### Logs

Check the console and network tabs in your browser's developer tools for detailed error information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.


