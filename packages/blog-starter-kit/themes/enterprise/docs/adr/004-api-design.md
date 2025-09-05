# ADR-004: API Design Patterns

**Date**: 2025-01-09  
**Status**: Accepted  
**Deciders**: Development Team

## Context

The Mindware Blog platform requires a robust API layer for:
- Content management operations
- User authentication and authorization
- Integration with external services
- Admin dashboard functionality
- Public blog data access

We need to establish consistent API design patterns that ensure maintainability, type safety, and excellent developer experience.

## Decision

We will use **RESTful API design** with Next.js API routes, following these patterns:

### Implementation Details

- **API Routes**: Next.js App Router API routes (`app/api/`)
- **HTTP Methods**: Standard REST verbs (GET, POST, PUT, DELETE, PATCH)
- **Response Format**: Consistent JSON response structure
- **Error Handling**: Standardized error responses with proper HTTP status codes
- **Authentication**: NextAuth.js session validation
- **Validation**: Zod schema validation for request/response data
- **Type Safety**: Full TypeScript integration with generated types

### API Structure

```
app/api/
├── auth/                 # Authentication endpoints
├── admin/               # Admin-only operations
├── articles/            # Article management
├── case-studies/        # Case study management
├── users/               # User management
├── analytics/           # Analytics data
├── webhooks/            # External webhook handlers
└── health/              # Health check endpoints
```

## Consequences

### Positive

- **Consistency**: Standardized API patterns across all endpoints
- **Type Safety**: Full TypeScript support with generated types
- **Developer Experience**: Intuitive RESTful patterns
- **Documentation**: Easy to document and understand
- **Testing**: Straightforward to test with standard HTTP tools
- **Caching**: HTTP caching works naturally with RESTful design
- **Tooling**: Excellent tooling support (Postman, curl, etc.)

### Negative

- **Over-fetching**: RESTful APIs can lead to over-fetching data
- **Under-fetching**: Multiple requests may be needed for complex data
- **Versioning**: API versioning can be complex with REST
- **Real-time**: REST is not ideal for real-time features

### Neutral

- **Learning Curve**: Team needs to understand RESTful conventions
- **Performance**: Multiple requests may impact performance
- **Complexity**: Complex operations may require multiple endpoints

## Alternatives Considered

### GraphQL
- **Pros**: Flexible queries, single endpoint, strong typing
- **Cons**: Complexity, caching challenges, learning curve
- **Decision**: Rejected due to complexity and overkill for current needs

### tRPC
- **Pros**: End-to-end type safety, excellent DX, lightweight
- **Cons**: TypeScript-only, smaller ecosystem, learning curve
- **Decision**: Considered but REST provides better tooling and familiarity

### gRPC
- **Pros**: High performance, strong typing, streaming support
- **Cons**: Complex setup, HTTP/2 only, limited browser support
- **Decision**: Rejected due to complexity and browser limitations

## API Design Patterns

### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
```

### Error Handling
```typescript
export function createErrorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details }
    },
    { status }
  );
}
```

### Request Validation
```typescript
import { z } from 'zod';

const CreateArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateArticleSchema.parse(body);
    // Process validated data...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid input data', 400, error.errors);
    }
    throw error;
  }
}
```

### Authentication Middleware
```typescript
export async function withAuth(handler: ApiHandler) {
  return async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return createErrorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }
    
    return handler(req, res, session);
  };
}
```

### Pagination
```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: Math.min(parseInt(searchParams.get('limit') || '10'), 100),
    sort: searchParams.get('sort') || 'createdAt',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
  };
}
```

## API Documentation

- **OpenAPI Spec**: Generate OpenAPI 3.0 specification
- **Interactive Docs**: Swagger UI for API exploration
- **Type Generation**: Generate TypeScript types from OpenAPI spec
- **Testing**: Automated API testing with generated types

## Security Considerations

- **Authentication**: All protected endpoints require valid session
- **Authorization**: Role-based access control for admin operations
- **Input Validation**: All inputs validated with Zod schemas
- **Rate Limiting**: Implement rate limiting on public endpoints
- **CORS**: Proper CORS configuration for cross-origin requests
- **Security Headers**: Implement security headers on all responses
