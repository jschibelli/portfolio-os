# Dashboard Port Configuration

## Port Assignment: 3003

The dashboard application is configured to run on port 3003 to avoid conflicts with other applications in the monorepo.

### Port Allocation Strategy

- **Site App**: Port 3000 (default Next.js port)
- **Docs App**: Port 3001 
- **Dashboard App**: Port 3003

### Configuration

The port is configured in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3003"
  }
}
```

### Why Port 3003?

- Avoids conflicts with the main site application (port 3000)
- Avoids conflicts with the documentation application (port 3001)
- Provides clear separation between different applications in the monorepo
- Allows all applications to run simultaneously during development

### Development Workflow

When developing locally, you can run:

```bash
# Terminal 1: Site application
cd apps/site && npm run dev

# Terminal 2: Dashboard application
cd apps/dashboard && npm run dev

# Terminal 3: Documentation application
cd apps/docs && npm run dev
```

All applications will run simultaneously without port conflicts.

## Production Deployment Guidelines

### Port Configuration in Production

In production environments, port assignments may differ based on deployment strategy:

#### Traditional Server Deployment
- **Reverse Proxy Setup**: Use nginx or Apache to route traffic
- **Port Mapping**: Map external ports (80/443) to internal application ports
- **Environment Variables**: Use `PORT` environment variable for flexibility

```bash
# Production environment variable
export PORT=3003
npm run start
```

#### Containerized Deployment (Docker/Kubernetes)
- **Service Discovery**: Use container orchestration for port management
- **Internal Ports**: Applications use internal ports (3003, 3001, 3000)
- **External Exposure**: Services expose through load balancers

```dockerfile
# Dockerfile example
EXPOSE 3003
ENV PORT=3003
CMD ["npm", "run", "start"]
```

#### Serverless Deployment (Vercel/Netlify)
- **Automatic Port Assignment**: Platforms handle port assignment automatically
- **Environment Configuration**: Use platform-specific environment variables
- **Build-time Configuration**: Ports configured during build process

## Dynamic Port Assignment Considerations

### Future Scalability

For enhanced flexibility and conflict prevention:

#### 1. Port Discovery Service
```typescript
// Example: Port discovery utility
export function findAvailablePort(startPort: number = 3000): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address()?.port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve).catch(reject);
    });
  });
}
```

#### 2. Environment-based Configuration
```typescript
// Port configuration with fallbacks
const PORT_CONFIG = {
  development: {
    site: process.env.SITE_PORT || 3000,
    dashboard: process.env.DASHBOARD_PORT || 3003,
    docs: process.env.DOCS_PORT || 3001
  },
  production: {
    site: process.env.PORT || 3000,
    dashboard: process.env.DASHBOARD_PORT || 3003,
    docs: process.env.DOCS_PORT || 3001
  }
};
```

#### 3. Health Check Integration
```typescript
// Health check with port validation
export function validatePortAvailability(port: number): boolean {
  try {
    const server = net.createServer();
    server.listen(port);
    server.close();
    return true;
  } catch {
    return false;
  }
}
```
