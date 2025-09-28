# Dashboard Application

## Development Setup

### Port Configuration
The dashboard application runs on port 3003 by default to avoid conflicts with other applications in the monorepo.

```bash
npm run dev  # Runs on http://localhost:3003
```

### Available Scripts

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
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Quality Assurance

- `npm run quality:check` - Run code quality checks
- `npm run quality:maintenance` - Run dependency maintenance checks
- `npm run quality:verify` - Verify implementation
- `npm run quality:all` - Run all quality checks

## Port Configuration Notes

The dashboard uses port 3003 to avoid conflicts with:
- Main site application (port 3000)
- Documentation application (port 3001)
- Other services in the monorepo

### Port Assignment Strategy
- **Development**: Fixed port 3003 for consistency (`npm run dev`)
- **Production**: Default Next.js port 3000 (`npm run start`)
- **Flexible**: Environment-based ports (`npm run dev:env`, `npm run start:env`)

### Environment Variables
- `DASHBOARD_PORT` - Custom development port (defaults to 3003)
- `PORT` - Custom production port (defaults to 3003 when using `start:env`)

For detailed port configuration information, see [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md) and [DEVELOPMENT_SCRIPTS.md](./DEVELOPMENT_SCRIPTS.md).