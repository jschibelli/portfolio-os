# Dashboard Application

A comprehensive admin dashboard for managing blog content, articles, and user interactions.

## Features

### Article Management
- **Rich Text Editor**: Full-featured editor with TipTap integration
- **Enhanced Toolbar**: Comprehensive formatting options matching Hashnode's editor
- **Image Upload**: Secure image handling with validation
- **Draft Management**: Auto-save and draft functionality
- **Scheduling**: Schedule articles for future publication

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

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

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