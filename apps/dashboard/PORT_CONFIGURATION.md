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
