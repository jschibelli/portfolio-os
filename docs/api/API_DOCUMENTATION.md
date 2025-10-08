# Portfolio OS API Documentation

## Overview

This document provides comprehensive API documentation for the Portfolio OS system, including endpoints, authentication, data models, and integration examples.

## 📋 **Table of Contents**

1. [Authentication](#authentication)
2. [Endpoints](#endpoints)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Examples](#examples)
7. [SDKs](#sdks)

## 🔐 **Authentication**

### **API Key Authentication**

All API requests require authentication using an API key:

```http
Authorization: Bearer YOUR_API_KEY
```

### **Getting API Keys**

1. Navigate to Dashboard → Settings → API Keys
2. Generate a new API key
3. Copy and store securely
4. Use in API requests

### **Key Permissions**

- **Read**: Access to public data
- **Write**: Create and update content
- **Admin**: Full system access

## 🛠️ **Endpoints**

### **Base URL**

```
Production: https://johnschibelli.dev/api
Staging: https://staging.johnschibelli.dev/api
Local: http://localhost:3000/api
```

### **Content Endpoints**

#### **Get All Projects**
```http
GET /api/projects
```

**Response:**
```json
{
  "projects": [
    {
      "id": "proj_123",
      "title": "Portfolio OS",
      "description": "Comprehensive portfolio management system",
      "technologies": ["Next.js", "TypeScript", "Tailwind"],
      "status": "published",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### **Get Single Project**
```http
GET /api/projects/{id}
```

**Response:**
```json
{
  "id": "proj_123",
  "title": "Portfolio OS",
  "description": "Comprehensive portfolio management system",
  "longDescription": "Detailed project description...",
  "technologies": ["Next.js", "TypeScript", "Tailwind"],
  "status": "published",
  "demoUrl": "https://johnschibelli.dev",
  "sourceUrl": "https://github.com/johnschibelli/portfolio-os",
  "images": [
    {
      "url": "https://cdn.example.com/image1.jpg",
      "alt": "Project screenshot",
      "type": "screenshot"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

#### **Create Project**
```http
POST /api/projects
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "technologies": ["React", "Node.js"],
  "status": "draft"
}
```

#### **Update Project**
```http
PUT /api/projects/{id}
Content-Type: application/json

{
  "title": "Updated Project Title",
  "description": "Updated description"
}
```

#### **Delete Project**
```http
DELETE /api/projects/{id}
```

### **Blog Endpoints**

#### **Get All Posts**
```http
GET /api/blog
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `status`: Filter by status (published, draft)

#### **Get Single Post**
```http
GET /api/blog/{slug}
```

#### **Create Post**
```http
POST /api/blog
Content-Type: application/json

{
  "title": "Blog Post Title",
  "content": "Blog post content in Markdown",
  "excerpt": "Short description",
  "category": "Technology",
  "tags": ["web-development", "react"],
  "status": "draft"
}
```

### **Analytics Endpoints**

#### **Get Site Analytics**
```http
GET /api/analytics
```

**Response:**
```json
{
  "visitors": {
    "total": 1250,
    "unique": 890,
    "returning": 360
  },
  "pageViews": {
    "total": 3450,
    "average": 2.76
  },
  "topPages": [
    {
      "path": "/",
      "views": 450,
      "title": "Homepage"
    }
  ],
  "referrers": [
    {
      "domain": "google.com",
      "visits": 320
    }
  ]
}
```

#### **Get Project Analytics**
```http
GET /api/analytics/projects/{id}
```

### **User Endpoints**

#### **Get User Profile**
```http
GET /api/user/profile
```

#### **Update User Profile**
```http
PUT /api/user/profile
Content-Type: application/json

{
  "name": "John Schibelli",
  "bio": "Full-stack developer",
  "location": "New York, NY",
  "website": "https://johnschibelli.dev"
}
```

## 📊 **Data Models**

### **Project Model**

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  status: 'published' | 'draft' | 'archived';
  demoUrl?: string;
  sourceUrl?: string;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectImage {
  url: string;
  alt: string;
  type: 'screenshot' | 'logo' | 'diagram';
  width?: number;
  height?: number;
}
```

### **Blog Post Model**

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    email: string;
  };
}
```

### **Analytics Model**

```typescript
interface Analytics {
  visitors: {
    total: number;
    unique: number;
    returning: number;
  };
  pageViews: {
    total: number;
    average: number;
  };
  topPages: PageView[];
  referrers: Referrer[];
  timeRange: {
    start: string;
    end: string;
  };
}

interface PageView {
  path: string;
  views: number;
  title: string;
}

interface Referrer {
  domain: string;
  visits: number;
}
```

## ⚠️ **Error Handling**

### **Error Response Format**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ],
    "timestamp": "2024-01-20T10:30:00Z"
  }
}
```

### **HTTP Status Codes**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### **Common Error Codes**

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - API key missing or invalid
- `PERMISSION_DENIED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests

## 🚦 **Rate Limiting**

### **Rate Limits**

- **Public API**: 100 requests per hour
- **Authenticated API**: 1000 requests per hour
- **Admin API**: 5000 requests per hour

### **Rate Limit Headers**

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642680000
```

### **Rate Limit Exceeded**

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again later.",
    "retryAfter": 3600
  }
}
```

## 💡 **Examples**

### **JavaScript/TypeScript**

```typescript
// Fetch all projects
const response = await fetch('/api/projects', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.projects);

// Create new project
const newProject = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My New Project',
    description: 'Project description',
    technologies: ['React', 'Node.js'],
    status: 'draft'
  })
});
```

### **Python**

```python
import requests

# Fetch projects
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://johnschibelli.dev/api/projects', headers=headers)
projects = response.json()

# Create project
project_data = {
    'title': 'My New Project',
    'description': 'Project description',
    'technologies': ['React', 'Node.js'],
    'status': 'draft'
}

response = requests.post(
    'https://johnschibelli.dev/api/projects',
    headers=headers,
    json=project_data
)
```

### **cURL**

```bash
# Get all projects
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://johnschibelli.dev/api/projects

# Create project
curl -X POST \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"title":"My Project","description":"Description","technologies":["React"]}' \
     https://johnschibelli.dev/api/projects
```

## 📦 **SDKs**

### **JavaScript SDK**

```typescript
import { PortfolioAPI } from '@portfolio-os/sdk';

const api = new PortfolioAPI({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://johnschibelli.dev/api'
});

// Get projects
const projects = await api.projects.getAll();

// Create project
const project = await api.projects.create({
  title: 'New Project',
  description: 'Description',
  technologies: ['React']
});
```

### **Python SDK**

```python
from portfolio_os import PortfolioAPI

api = PortfolioAPI(
    api_key='YOUR_API_KEY',
    base_url='https://johnschibelli.dev/api'
)

# Get projects
projects = api.projects.get_all()

# Create project
project = api.projects.create({
    'title': 'New Project',
    'description': 'Description',
    'technologies': ['React']
})
```

## 🔗 **Integration Examples**

### **Next.js Integration**

```typescript
// pages/api/external-projects.ts
export default async function handler(req, res) {
  const response = await fetch('https://johnschibelli.dev/api/projects', {
    headers: {
      'Authorization': `Bearer ${process.env.PORTFOLIO_API_KEY}`
    }
  });
  
  const data = await response.json();
  res.json(data);
}
```

### **React Component**

```tsx
import { useState, useEffect } from 'react';

export function ProjectsList() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects));
  }, []);
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

**This API documentation provides everything needed to integrate with the Portfolio OS system!** 🚀
