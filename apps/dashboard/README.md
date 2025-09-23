# Dashboard Application

A comprehensive admin dashboard for content management, built with Next.js 14+ and modern web technologies.

## 🚀 Features

- **Content Management**: Create, edit, and publish articles
- **User Management**: Role-based access control and user administration
- **Analytics**: Comprehensive reporting and analytics dashboard
- **Media Management**: File upload and media library management
- **Newsletter Management**: Email campaign creation and management
- **Case Studies**: Project showcase and case study management

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js with role-based access control
- **Styling**: Tailwind CSS with custom design system
- **Type Safety**: TypeScript with strict configuration
- **Testing**: Jest, React Testing Library, and Playwright
- **Deployment**: Vercel with automated CI/CD

## 📦 Dependencies

### Core Dependencies
- `next`: ^14.2.32 - React framework
- `react`: ^18.3.1 - UI library
- `typescript`: ^5.2.2 - Type safety
- `prisma`: ^5.0.0 - Database ORM
- `tailwindcss`: ^3.3.3 - CSS framework

### Development Dependencies
- `@testing-library/react`: ^16.3.0 - Component testing
- `@testing-library/jest-dom`: ^6.8.0 - DOM testing utilities
- `jest`: ^30.1.3 - Testing framework
- `playwright`: ^1.55.0 - End-to-end testing
- `prettier`: ^3.0.3 - Code formatting
- `eslint`: Code linting and quality

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- Database (SQLite for development, PostgreSQL for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jschibelli/mindware-blog.git
   cd mindware-blog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/dashboard/.env.example apps/dashboard/.env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3001"
   
   # Admin Configuration
   AUTH_ADMIN_EMAIL="admin@example.com"
   AUTH_ADMIN_PASSWORD="secure-password"
   
   # API Configuration
   API_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   cd apps/dashboard
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

The dashboard will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
apps/dashboard/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── login/             # Authentication pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Database connection
│   ├── validation.ts     # Input validation
│   ├── error-handling.ts # Error handling utilities
│   └── testing-utils.ts  # Testing utilities
├── __tests__/            # Test files
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔐 Security Features

### Authentication & Authorization
- **Role-based Access Control (RBAC)**: Admin, Editor, Author, Guest roles
- **Session Management**: Secure session handling with NextAuth.js
- **Permission System**: Granular permissions for different actions
- **Password Security**: Bcrypt hashing with salt rounds

### Input Validation & Sanitization
- **XSS Protection**: Input sanitization and output encoding
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API endpoint protection against abuse

### Data Security
- **Environment Variables**: Secure configuration management
- **Database Security**: Connection encryption and access controls
- **File Upload Security**: File type validation and size limits
- **Audit Logging**: Comprehensive logging for security monitoring

## 🧪 Testing Strategy

### Unit Tests
- **Component Testing**: React component behavior and rendering
- **Utility Testing**: Function logic and edge cases
- **Validation Testing**: Input validation and sanitization
- **Authentication Testing**: Login, logout, and permission checks

### Integration Tests
- **API Testing**: Endpoint functionality and error handling
- **Database Testing**: CRUD operations and data integrity
- **Authentication Flow**: Complete user authentication workflows
- **File Upload Testing**: Media upload and processing

### End-to-End Tests
- **User Workflows**: Complete user journeys through the dashboard
- **Admin Operations**: Content creation and management workflows
- **Error Scenarios**: Error handling and recovery testing
- **Performance Testing**: Load testing and optimization validation

### Security Testing
- **XSS Testing**: Cross-site scripting vulnerability testing
- **SQL Injection Testing**: Database injection attack prevention
- **Authentication Testing**: Session security and access control
- **Input Validation**: Malicious input handling and sanitization

## 📊 Performance Monitoring

### Metrics Tracked
- **Page Load Times**: Core Web Vitals and performance metrics
- **Database Performance**: Query execution times and optimization
- **API Response Times**: Endpoint performance and caching effectiveness
- **Error Rates**: Application stability and error tracking

### Optimization Strategies
- **Database Indexing**: Optimized queries and index strategies
- **Caching**: Redis caching for frequently accessed data
- **Code Splitting**: Dynamic imports and bundle optimization
- **Image Optimization**: Next.js Image component with optimization

## 🚀 Deployment

### Production Environment
- **Vercel Deployment**: Automated deployment from main branch
- **Environment Configuration**: Production environment variables
- **Database Migration**: Automated schema updates and migrations
- **Monitoring**: Error tracking and performance monitoring

### CI/CD Pipeline
- **Automated Testing**: Unit, integration, and E2E tests
- **Code Quality**: ESLint, Prettier, and TypeScript checks
- **Security Scanning**: Vulnerability assessment and dependency checks
- **Performance Testing**: Load testing and optimization validation

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Session validation

### Content Management
- `GET /api/admin/articles` - List articles
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/[id]` - Update article
- `DELETE /api/admin/articles/[id]` - Delete article

### User Management
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Media Management
- `POST /api/admin/media/upload` - Upload media files
- `GET /api/admin/media` - List media files
- `DELETE /api/admin/media/[id]` - Delete media file

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Reset database
npx prisma db push --force-reset
npx prisma db seed
```

#### Authentication Issues
```bash
# Clear session data
rm -rf .next
pnpm dev
```

#### Build Issues
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Error Codes
- `AUTH_REQUIRED`: User authentication required
- `AUTH_INVALID`: Invalid authentication credentials
- `VALIDATION_FAILED`: Input validation failed
- `RECORD_NOT_FOUND`: Database record not found
- `API_RATE_LIMITED`: Too many API requests

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run quality checks and tests
4. Submit pull request with description
5. Address review feedback
6. Merge after approval

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and style enforcement
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage required
- **Documentation**: Clear code comments and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

---

**Last Updated**: January 23, 2025  
**Version**: 1.0.0  
**Maintainer**: John Schibelli
