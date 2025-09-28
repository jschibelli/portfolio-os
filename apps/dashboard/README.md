# Dashboard Application

## Development Setup

### Port Configuration
The dashboard application runs on port 3001 by default to avoid conflicts with other applications in the monorepo.

```bash
npm run dev  # Runs on http://localhost:3001
```

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ci` - Run tests in CI mode
- `npm run test:coverage` - Run tests with coverage

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

The dashboard uses port 3001 to avoid conflicts with:
- Main site application (typically port 3000)
- Other services in the monorepo
- Common development ports

If you need to change the port, update the `dev` script in `package.json` and ensure no other services are using the same port.