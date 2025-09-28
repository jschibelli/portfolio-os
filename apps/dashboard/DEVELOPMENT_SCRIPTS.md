# Dashboard Development Scripts Configuration

## Scripts Overview

The dashboard application uses the following npm scripts for development and deployment:

### Development Scripts

#### `npm run dev`
- **Purpose**: Start the development server
- **Port**: 3003 (configured to avoid conflicts)
- **Command**: `next dev -p 3003`
- **Usage**: Primary development command for local development

#### `npm run build`
- **Purpose**: Build the application for production
- **Command**: `next build`
- **Output**: Optimized production build in `.next` directory

#### `npm run start`
- **Purpose**: Start the production server
- **Command**: `next start`
- **Port**: Uses Next.js default port (3000)
- **Note**: For custom ports, use `npm run start:env` with PORT environment variable

#### `npm run lint`
- **Purpose**: Run ESLint for code quality checks
- **Command**: `next lint`
- **Usage**: Automated code quality validation

### Environment-Based Scripts

#### `npm run dev:env`
- **Purpose**: Start development server with environment-based port
- **Command**: `next dev -p ${DASHBOARD_PORT:-3003}`
- **Port**: Uses `DASHBOARD_PORT` environment variable or defaults to 3003
- **Usage**: Flexible development with custom port configuration

#### `npm run start:env`
- **Purpose**: Start production server with environment-based port
- **Command**: `next start -p ${PORT:-3003}`
- **Port**: Uses `PORT` environment variable or defaults to 3003
- **Usage**: Production deployment with custom port configuration

## Port Configuration Strategy

### Development Environment
- **Default Port**: 3003 for development consistency (`npm run dev`)
- **Flexible Port**: Environment-based with `npm run dev:env`
- **Rationale**: Avoids conflicts with other monorepo applications
- **Benefits**: Predictable development environment with flexibility option

### Production Environment
- **Default Port**: Next.js default (3000) for standard deployments (`npm run start`)
- **Flexible Port**: Environment-based with `npm run start:env`
- **Rationale**: Allows deployment flexibility across different platforms
- **Benefits**: Works with containerized deployments, serverless platforms

## Environment Variables

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Port Configuration (Production)
PORT=3003  # Optional: defaults to 3000 if not set
```

### Development Environment Variables
```bash
# Local development
DASHBOARD_PORT=3003  # Override default port if needed
```

## Deployment Considerations

### Docker Deployment
```dockerfile
# Use environment variable for port flexibility
ENV PORT=3003
EXPOSE 3003
CMD ["npm", "run", "start"]
```

### Vercel Deployment
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "PORT": "3003"
  }
}
```

### Traditional Server
```bash
# Set port via environment variable
export PORT=3003
npm run start
```

## Script Consistency

All scripts follow consistent patterns:

1. **Development**: `dev` script uses fixed port for consistency
2. **Production**: `start` script uses environment variable for flexibility
3. **Build**: `build` script is environment-agnostic
4. **Quality**: `lint` script follows Next.js standards

## Troubleshooting

### Port Conflicts
If port 3003 is already in use:

1. **Check what's using the port**:
   ```bash
   lsof -i :3003  # macOS/Linux
   netstat -ano | findstr :3003  # Windows
   ```

2. **Use different port temporarily**:
   ```bash
   npm run dev -- -p 3004
   ```

3. **Update configuration**:
   ```bash
   export DASHBOARD_PORT=3004
   npm run dev
   ```

### Build Issues
If build fails:

1. **Clear cache**:
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check dependencies**:
   ```bash
   npm install
   npm run build
   ```

## Best Practices

1. **Development**: Use `npm run dev` for standard development (port 3003)
2. **Development (Custom Port)**: Use `npm run dev:env` with `DASHBOARD_PORT` environment variable
3. **Production (Standard)**: Use `npm run start` for standard deployments (port 3000)
4. **Production (Custom Port)**: Use `npm run start:env` with `PORT` environment variable
5. **Test builds locally before deployment**
6. **Run linting before commits**
7. **Document any custom port configurations**
