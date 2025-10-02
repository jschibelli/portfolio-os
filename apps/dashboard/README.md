# Dashboard Application

A comprehensive admin dashboard for managing blog content, articles, and user interactions.

## Features

### Article Management
- **Rich Text Editor**: Full-featured editor with TipTap integration
- **Enhanced Toolbar**: Comprehensive formatting options matching Hashnode's editor
- **Image Upload**: Secure image handling with validation
- **Draft Management**: Auto-save and draft functionality
- **Scheduling**: Schedule articles for future publication
- **Unified Publishing Workflow**: Multi-platform publishing system with Hashnode integration

### Content Management
- **Article Creation**: Create and edit articles with rich formatting
- **Media Library**: Upload and manage media files
- **Case Studies**: Manage project case studies
- **Newsletter**: Email campaign management
- **Comments**: Moderate and manage user comments

### Analytics & Insights
- **Dashboard Analytics**: Comprehensive metrics and insights
- **User Activity**: Track user interactions and engagement
- **Performance Metrics**: Monitor site performance and SEO
- **Traffic Analysis**: Detailed traffic and visitor analytics

### User Management
- **Role-Based Access**: Granular permission system
- **User Profiles**: Manage user accounts and permissions
- **Security**: Advanced authentication and authorization

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js
- **Editor**: TipTap with rich extensions
- **Testing**: Jest with React Testing Library
- **Validation**: Custom validation utilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-os/apps/dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3003"
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3003`

### Port Configuration
The dashboard application runs on port 3003 by default to avoid conflicts with other applications in the monorepo.

```bash
npm run dev  # Runs on http://localhost:3003
```

## Project Structure

```
apps/dashboard/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard pages
│   │   ├── articles/            # Article management
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── media/               # Media management
│   │   ├── settings/            # Application settings
│   │   └── users/                # User management
│   ├── api/                      # API routes
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   └── ErrorBoundary.tsx        # Error handling
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Authentication logic
│   ├── validation.ts            # Input validation
│   └── error-handling.ts        # Error handling utilities
├── __tests__/                   # Test files
│   ├── setup.ts                 # Test setup
│   └── EditorToolbar.test.tsx   # Component tests
└── scripts/                     # Build and utility scripts
```

## Key Components

### EditorToolbar
Enhanced toolbar component with comprehensive formatting options:

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1-H6 with dropdown selection
- **Lists**: Bullet, numbered, and task lists
- **Code**: Inline code and code blocks
- **Links**: URL validation and secure link insertion
- **Tables**: Dynamic table insertion
- **Media**: Image upload and management
- **Actions**: Undo, redo, clear formatting

### Scripts

#### Standard Scripts
- `npm run dev` - Start development server on port 3003
- `npm run build` - Build for production
- `npm run start` - Start production server on default port (3000)
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ci` - Run tests in CI mode
- `npm run test:coverage` - Run tests with coverage

#### Environment-Based Scripts
- `npm run dev:env` - Start development server with custom port (via `DASHBOARD_PORT` env var)
- `npm run start:env` - Start production server with custom port (via `PORT` env var)

### Database Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Unified Publishing Workflow

The Dashboard includes a comprehensive unified publishing workflow that allows you to publish content to multiple platforms from a single interface.

### Features

- **Multi-Platform Publishing**: Publish to Dashboard, Hashnode, Dev.to, Medium, and LinkedIn
- **Publishing Queue**: Schedule content for future publishing with automatic processing
- **Status Tracking**: Real-time tracking of publishing status across all platforms
- **Publishing Templates**: Pre-configured templates for quick publishing
- **Cross-Platform Analytics**: Unified analytics dashboard showing performance across all platforms
- **Retry Logic**: Automatic retry with exponential backoff for failed publishing attempts

### Quick Start

1. **Configure Platform Credentials**

   Add the following environment variables to your `.env.local`:

   ```env
   # Hashnode
   HASHNODE_API_TOKEN=your-hashnode-token
   HASHNODE_PUBLICATION_ID=your-publication-id

   # Dev.to
   DEVTO_API_KEY=your-devto-api-key

   # Medium
   MEDIUM_USER_ID=your-medium-user-id
   MEDIUM_ACCESS_TOKEN=your-medium-token

   # LinkedIn
   LINKEDIN_ACCESS_TOKEN=your-linkedin-token
   LINKEDIN_AUTHOR_ID=your-linkedin-author-id

   # Enable automatic queue processing
   ENABLE_QUEUE_PROCESSOR=true
   ```

2. **Run Database Migration**

   The unified publishing workflow requires additional database tables:

   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Initialize Default Templates**

   Run this in your application or via a migration script:

   ```typescript
   import { initializeDefaultTemplates } from '@/lib/publishing/default-templates';
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();
   await initializeDefaultTemplates(prisma);
   ```

### Publishing API Endpoints

- `POST /api/publishing/publish` - Publish or schedule an article
- `GET /api/publishing/queue` - Get publishing queue
- `POST /api/publishing/queue` - Add item to queue
- `DELETE /api/publishing/queue?id=xxx` - Remove from queue
- `POST /api/publishing/queue/process` - Manually trigger queue processing
- `GET /api/publishing/templates` - Get publishing templates
- `POST /api/publishing/templates` - Create template
- `GET /api/publishing/analytics` - Get analytics
- `POST /api/publishing/analytics/refresh` - Refresh analytics

### Using the Publishing Workflow

```typescript
// Publish to multiple platforms
const response = await fetch('/api/publishing/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: 'article-id',
    options: {
      platforms: [
        {
          id: 'dashboard',
          name: 'dashboard',
          enabled: true,
          status: 'pending',
          settings: {}
        },
        {
          id: 'hashnode',
          name: 'hashnode',
          enabled: true,
          status: 'pending',
          settings: {
            publicationId: process.env.HASHNODE_PUBLICATION_ID
          }
        }
      ],
      crossPost: true,
      tags: ['javascript', 'tutorial'],
      seo: {
        title: 'SEO Title',
        description: 'SEO Description'
      },
      social: {
        autoShare: true,
        platforms: ['twitter', 'linkedin']
      }
    }
  })
});
```

For complete documentation, see [UNIFIED_PUBLISHING_WORKFLOW.md](./UNIFIED_PUBLISHING_WORKFLOW.md).

### Database Commands

### Error Handling
Comprehensive error handling system:

- **Error Boundaries**: React error boundaries for component isolation
- **Validation**: Input validation with security measures
- **Logging**: Structured error logging and monitoring
- **Recovery**: Graceful error recovery mechanisms

### Security Features
- **Input Validation**: Comprehensive input sanitization
- **XSS Prevention**: Content sanitization and validation
- **Rate Limiting**: API rate limiting and abuse prevention
- **Authentication**: Secure authentication and authorization

## Development

### Code Quality
The project includes comprehensive quality assurance tools:

```bash
# Run all quality checks
npm run quality:all

# Individual quality checks
npm run quality:check        # Code quality
npm run quality:maintenance  # Dependency maintenance
npm run quality:verify       # Implementation verification
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### Article Management
- `GET /api/admin/articles` - List articles
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/[id]` - Update article
- `DELETE /api/admin/articles/[id]` - Delete article

### Media Management
- `GET /api/admin/media` - List media files
- `POST /api/admin/media` - Upload media
- `DELETE /api/admin/media/[id]` - Delete media

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all required environment variables are configured:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Application URL
- `UPLOADTHING_SECRET`: File upload service secret
- `UPLOADTHING_APP_ID`: File upload service app ID

### Port Configuration Details
The dashboard uses port 3003 to avoid conflicts with:
- Main site application (port 3000)
- Documentation application (port 3001)
- Other services in the monorepo

#### Port Assignment Strategy
- **Development**: Fixed port 3003 for consistency (`npm run dev`)
- **Production**: Default Next.js port 3000 (`npm run start`)
- **Flexible**: Environment-based ports (`npm run dev:env`, `npm run start:env`)

#### Environment Variables
- `DASHBOARD_PORT` - Custom development port (defaults to 3003)
- `PORT` - Custom production port (defaults to 3003 when using `start:env`)

For detailed port configuration information, see [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md) and [DEVELOPMENT_SCRIPTS.md](./DEVELOPMENT_SCRIPTS.md).

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request`

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Ensure all quality checks pass
- Update documentation for new features
- Follow the established code style

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check database permissions

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL configuration
   - Ensure session configuration is correct

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [Documentation](https://docs.your-site.com)
- Contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
