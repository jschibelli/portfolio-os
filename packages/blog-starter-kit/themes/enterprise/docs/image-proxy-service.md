# Image Proxy Service

A secure, high-performance image proxy service for the Mindware Blog that provides enhanced security, rate limiting, and performance optimization for external images.

## 🚀 Features

- **Security First**: SSRF protection, domain whitelisting, and content validation
- **Rate Limiting**: Prevents abuse with configurable limits (100 requests per 15 minutes)
- **Performance**: Caching, compression, and optimized headers
- **Monitoring**: Comprehensive logging and error tracking
- **Accessibility**: Proper error handling and user feedback

## 📋 API Endpoint

```
GET /api/image-proxy?url=<image_url>
```

### Parameters

- `url` (required): The URL of the image to proxy

### Example Usage

```javascript
// Basic usage
const imageUrl = 'https://unsplash.com/photo-1234567890';
const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;

// In React component
<Image src={proxyUrl} alt="Proxied image" />
```

## 🔒 Security Features

### Domain Whitelist

Only images from approved domains are allowed:

- `unsplash.com` and `images.unsplash.com`
- `picsum.photos`
- `via.placeholder.com`
- `cdn.jsdelivr.net`
- `raw.githubusercontent.com`
- `github.com` and `githubusercontent.com`

### SSRF Protection

The service blocks requests to private IP ranges:

- `127.0.0.0/8` (localhost)
- `10.0.0.0/8` (private class A)
- `172.16.0.0/12` (private class B)
- `192.168.0.0/16` (private class C)
- `169.254.0.0/16` (link-local)
- IPv6 private ranges

### Content Validation

- File size limit: 10MB maximum
- Content type validation: Only image/* types allowed
- File extension validation: .jpg, .jpeg, .png, .gif, .webp, .svg

## ⚡ Rate Limiting

### Configuration

- **Limit**: 100 requests per 15-minute window
- **Block Duration**: 1 hour for exceeding limits
- **Headers**: Rate limit information included in responses

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 3600
}
```

**Status Code**: 429 Too Many Requests

## 🛡️ Security Headers

All responses include comprehensive security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
X-Proxy-Source: MindwareBlog-ImageProxy
Cache-Control: public, max-age=3600
```

## 📊 Monitoring and Logging

### Success Logging

```
Successfully proxied image: https://unsplash.com/image.jpg (1024000 bytes)
```

### Error Logging

```
Image proxy error: Failed to fetch image: 404
```

### CSP Violation Reporting

The service integrates with the CSP reporting system at `/api/csp-report` to monitor and log security violations.

## 🧪 Testing

### Unit Tests

Run the comprehensive test suite:

```bash
npm test __tests__/api/image-proxy.test.ts
```

### Test Coverage

- ✅ Rate limiting functionality
- ✅ URL validation and security
- ✅ Error handling scenarios
- ✅ Security headers verification
- ✅ Caching behavior
- ✅ Content type validation
- ✅ File size limits

### Manual Testing

```bash
# Test valid image
curl "http://localhost:3000/api/image-proxy?url=https://picsum.photos/800/600"

# Test invalid URL
curl "http://localhost:3000/api/image-proxy?url=https://malicious-site.com/image.jpg"

# Test rate limiting
for i in {1..101}; do
  curl "http://localhost:3000/api/image-proxy?url=https://picsum.photos/800/600"
done
```

## 🔧 Configuration

### Environment Variables

```env
# Optional: Custom rate limiting
IMAGE_PROXY_RATE_LIMIT=100
IMAGE_PROXY_WINDOW_MS=900000
IMAGE_PROXY_BLOCK_DURATION_MS=3600000

# Optional: Custom file size limit
IMAGE_PROXY_MAX_FILE_SIZE=10485760
```

### Customization

To modify allowed domains, update the `ALLOWED_DOMAINS` array in `/app/api/image-proxy/route.ts`:

```typescript
const ALLOWED_DOMAINS = [
  'your-domain.com',
  'cdn.your-domain.com',
  // ... existing domains
];
```

## 🚨 Error Handling

### Common Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required parameter: url | No URL provided |
| 400 | Invalid or unsafe image URL | URL validation failed |
| 429 | Rate limit exceeded | Too many requests |
| 500 | Failed to proxy image | Network or server error |
| 500 | File too large | Image exceeds size limit |
| 500 | Invalid content type | Non-image content |

### Error Response Format

```json
{
  "error": "Error description",
  "retryAfter": 3600
}
```

## 🔄 Integration

### With Next.js Image Component

```typescript
import Image from 'next/image';

function MyComponent() {
  const imageUrl = 'https://unsplash.com/photo-1234567890';
  const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;

  return (
    <Image
      src={proxyUrl}
      alt="Proxied image"
      width={800}
      height={600}
    />
  );
}
```

### With PerformanceImage Component

```typescript
import { PerformanceImage } from '@/components/ui/performance-image';

function MyComponent() {
  const imageUrl = 'https://unsplash.com/photo-1234567890';
  const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;

  return (
    <PerformanceImage
      src={proxyUrl}
      alt="Proxied image with performance tracking"
      width={800}
      height={600}
      enablePerformanceTracking={true}
    />
  );
}
```

## 📈 Performance Optimization

### Caching Strategy

- **Browser Cache**: 1 hour (3600 seconds)
- **CDN Cache**: Respects cache headers
- **Memory Cache**: Rate limit store (in-memory)

### Compression

- **Accept-Encoding**: Supports gzip and deflate
- **Content-Length**: Accurate size reporting
- **Transfer Optimization**: Efficient data transfer

### Monitoring

- **Performance Metrics**: Tracked via PerformanceImage component
- **Error Rates**: Monitored and logged
- **Usage Statistics**: Rate limit tracking

## 🔮 Future Enhancements

- [ ] Redis-based rate limiting for production
- [ ] Image optimization and resizing
- [ ] WebP conversion for supported browsers
- [ ] CDN integration for global distribution
- [ ] Advanced caching strategies
- [ ] Real-time monitoring dashboard

## 📚 Related Documentation

- [Performance Monitoring System](./performance-accessibility-enhancements.md)
- [Security Headers Configuration](./security-headers.md)
- [CSP Reporting System](./csp-reporting.md)

---

*This image proxy service provides a secure, performant, and scalable solution for handling external images in the Mindware Blog application.*
