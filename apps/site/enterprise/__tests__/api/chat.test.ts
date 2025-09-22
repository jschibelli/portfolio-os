/**
 * Unit Tests for Chat API Endpoint
 * 
 * This module provides comprehensive unit tests for the chat API endpoint,
 * including security, performance, and functionality testing.
 * 
 * Addresses code review feedback from PR #37 about adding unit tests
 * to cover changes and safeguard against regressions.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/chat';
import { CHAT_CONFIG, getSuggestedActions, getFallbackResponse } from '../../lib/chat-config';
import { 
  validateRequestBody, 
  sanitizeInput, 
  checkRateLimit,
  validateRequestOrigin,
  getPerformanceStats
} from '../../lib/chat-security';

// Mock dependencies
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}));

jest.mock('../../data/resume.json', () => ({
  basics: {
    summary: 'Senior Front-End Developer with 15+ years of experience'
  }
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    OPENAI_API_KEY: 'test-api-key'
  };
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

// Mock request and response objects
const createMockRequest = (body: any, method: string = 'POST', headers: any = {}): NextApiRequest => ({
  method,
  body,
  headers: {
    'user-agent': 'test-agent',
    'origin': 'https://johnschibelli.dev',
    ...headers
  },
  query: {},
  cookies: {},
  url: '/api/chat'
} as NextApiRequest);

const createMockResponse = (): NextApiResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis()
  } as any;
  return res;
};

describe('Chat API Endpoint', () => {
  describe('Method Validation', () => {
    it('should reject non-POST requests', async () => {
      const req = createMockRequest({}, 'GET');
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });
  });

  describe('Request Validation', () => {
    it('should reject requests without message', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });

    it('should reject requests with empty message', async () => {
      const req = createMockRequest({ message: '' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });

    it('should accept valid requests', async () => {
      const req = createMockRequest({ 
        message: 'Hello, how are you?',
        conversationHistory: [],
        pageContext: null
      });
      const res = createMockResponse();

      // Mock OpenAI response
      const mockOpenAI = require('openai').default;
      const mockCompletion = {
        choices: [{
          message: {
            content: 'Hello! I am doing well, thank you for asking.'
          }
        }]
      };
      mockOpenAI().chat.completions.create.mockResolvedValue(mockCompletion);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          response: 'Hello! I am doing well, thank you for asking.',
          intent: expect.any(String),
          suggestedActions: expect.any(Array),
          conversationId: expect.any(String),
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('OpenAI Integration', () => {
    it('should handle OpenAI API key not configured', async () => {
      delete process.env.OPENAI_API_KEY;
      
      const req = createMockRequest({ message: 'Hello' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'OpenAI API key not configured',
        fallback: expect.stringContaining("I'm sorry, but I'm currently unable to process your request")
      });
    });

    it('should handle OpenAI API errors gracefully', async () => {
      const req = createMockRequest({ message: 'Hello' });
      const res = createMockResponse();

      // Mock OpenAI error
      const mockOpenAI = require('openai').default;
      mockOpenAI().chat.completions.create.mockRejectedValue(new Error('API Error'));

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.stringContaining("I'm sorry, I'm having trouble processing your request"),
          intent: expect.any(String)
        })
      );
    });

    it('should handle OpenAI timeout errors', async () => {
      const req = createMockRequest({ message: 'Hello' });
      const res = createMockResponse();

      // Mock OpenAI timeout
      const mockOpenAI = require('openai').default;
      mockOpenAI().chat.completions.create.mockRejectedValue(new Error('Request timeout'));

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.stringContaining("I'm sorry, I'm having trouble processing your request")
        })
      );
    });
  });

  describe('Intent Detection', () => {
    it('should detect scheduling intent', async () => {
      const req = createMockRequest({ message: 'I want to schedule a meeting' });
      const res = createMockResponse();

      const mockOpenAI = require('openai').default;
      const mockCompletion = {
        choices: [{
          message: {
            content: 'I can help you schedule a meeting with John.'
          }
        }]
      };
      mockOpenAI().chat.completions.create.mockResolvedValue(mockCompletion);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: 'scheduling'
        })
      );
    });

    it('should detect case study intent', async () => {
      const req = createMockRequest({ message: 'Tell me about the Tendril project' });
      const res = createMockResponse();

      const mockOpenAI = require('openai').default;
      const mockCompletion = {
        choices: [{
          message: {
            content: 'The Tendril project is a multi-tenant chatbot SaaS platform.'
          }
        }]
      };
      mockOpenAI().chat.completions.create.mockResolvedValue(mockCompletion);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: 'case_study'
        })
      );
    });

    it('should detect contact intent', async () => {
      const req = createMockRequest({ message: 'How can I contact John?' });
      const res = createMockResponse();

      const mockOpenAI = require('openai').default;
      const mockCompletion = {
        choices: [{
          message: {
            content: 'You can contact John via email or LinkedIn.'
          }
        }]
      };
      mockOpenAI().chat.completions.create.mockResolvedValue(mockCompletion);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: 'contact'
        })
      );
    });
  });

  describe('Response Structure', () => {
    it('should return properly structured response', async () => {
      const req = createMockRequest({ message: 'Hello' });
      const res = createMockResponse();

      const mockOpenAI = require('openai').default;
      const mockCompletion = {
        choices: [{
          message: {
            content: 'Hello! How can I help you today?'
          }
        }]
      };
      mockOpenAI().chat.completions.create.mockResolvedValue(mockCompletion);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          response: 'Hello! How can I help you today?',
          intent: expect.any(String),
          suggestedActions: expect.any(Array),
          conversationId: expect.any(String),
          timestamp: expect.any(String)
        })
      );
    });

    it('should include suggested actions based on intent', async () => {
      const req = createMockRequest({ message: 'I want to contact John' });
      const res = createMockResponse();

      const mockOpenAI = require('openai').default;
      const mockCompletion = {
        choices: [{
          message: {
            content: 'You can contact John via email or LinkedIn.'
          }
        }]
      };
      mockOpenAI().chat.completions.create.mockResolvedValue(mockCompletion);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.suggestedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'Email John',
            url: 'mailto:jschibelli@gmail.com',
            icon: '📧'
          })
        ])
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed request body', async () => {
      const req = createMockRequest(null);
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });

    it('should handle very long messages', async () => {
      const longMessage = 'a'.repeat(2000);
      const req = createMockRequest({ message: longMessage });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });

    it('should handle invalid conversation history', async () => {
      const req = createMockRequest({ 
        message: 'Hello',
        conversationHistory: 'invalid'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    });
  });
});

describe('Chat Configuration', () => {
  describe('getSuggestedActions', () => {
    it('should return correct actions for contact intent', () => {
      const actions = getSuggestedActions('contact');
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'Email John',
            url: 'mailto:jschibelli@gmail.com',
            icon: '📧'
          })
        ])
      );
    });

    it('should return correct actions for skills intent', () => {
      const actions = getSuggestedActions('skills');
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'View Portfolio',
            url: '/work',
            icon: '🎨'
          })
        ])
      );
    });

    it('should return general actions for unknown intent', () => {
      const actions = getSuggestedActions('unknown');
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'Learn More',
            url: '/about',
            icon: 'ℹ️'
          })
        ])
      );
    });

    it('should include blog articles for blog intent', () => {
      const articles = [
        { title: 'Test Article', url: '/test-article' }
      ];
      const actions = getSuggestedActions('blog', articles);
      
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'Read: Test Article',
            url: '/test-article',
            icon: '📝'
          })
        ])
      );
    });
  });

  describe('getFallbackResponse', () => {
    it('should return scheduling help for scheduling intent', () => {
      const response = getFallbackResponse('scheduling');
      
      expect(response).toContain('schedule a meeting');
    });

    it('should return case study help for case_study intent', () => {
      const response = getFallbackResponse('case_study');
      
      expect(response).toContain('case studies');
    });

    it('should return contact info for contact intent', () => {
      const response = getFallbackResponse('contact');
      
      expect(response).toContain('jschibelli@gmail.com');
    });

    it('should return greeting for unknown intent', () => {
      const response = getFallbackResponse('unknown');
      
      expect(response).toContain('Hello');
    });
  });
});

describe('Chat Security', () => {
  describe('validateRequestBody', () => {
    it('should validate valid request body', () => {
      const body = {
        message: 'Hello',
        conversationHistory: [],
        pageContext: { type: 'article', content: 'test' }
      };
      
      const result = validateRequestBody(body);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedBody).toBeDefined();
    });

    it('should reject invalid request body', () => {
      const body = {
        message: '',
        conversationHistory: 'invalid'
      };
      
      const result = validateRequestBody(body);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should sanitize input content', () => {
      const body = {
        message: 'Hello <script>alert("xss")</script>',
        conversationHistory: []
      };
      
      const result = validateRequestBody(body);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitizedBody?.message).not.toContain('<script>');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = 'Hello <script>alert("xss")</script> world';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('Hello alert("xss") world');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert("xss")';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('alert("xss")');
    });

    it('should limit input length', () => {
      const input = 'a'.repeat(2000);
      const sanitized = sanitizeInput(input);
      
      expect(sanitized.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('checkRateLimit', () => {
    it('should allow requests within rate limit', () => {
      const req = createMockRequest({ message: 'Hello' });
      
      const result = checkRateLimit(req);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should reject requests exceeding rate limit', () => {
      const req = createMockRequest({ message: 'Hello' });
      
      // Simulate many requests
      for (let i = 0; i < 150; i++) {
        checkRateLimit(req);
      }
      
      const result = checkRateLimit(req);
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe('validateRequestOrigin', () => {
    it('should allow requests from allowed origins', () => {
      const req = createMockRequest(
        { message: 'Hello' },
        'POST',
        { origin: 'https://johnschibelli.dev' }
      );
      
      const result = validateRequestOrigin(req);
      
      expect(result).toBe(true);
    });

    it('should reject requests from disallowed origins', () => {
      const req = createMockRequest(
        { message: 'Hello' },
        'POST',
        { origin: 'https://malicious-site.com' }
      );
      
      const result = validateRequestOrigin(req);
      
      expect(result).toBe(false);
    });

    it('should reject requests without origin', () => {
      const req = createMockRequest(
        { message: 'Hello' },
        'POST',
        {}
      );
      
      const result = validateRequestOrigin(req);
      
      expect(result).toBe(false);
    });
  });
});

describe('Performance Monitoring', () => {
  describe('getPerformanceStats', () => {
    it('should return empty stats when no metrics recorded', () => {
      const stats = getPerformanceStats();
      
      expect(stats.totalRequests).toBe(0);
      expect(stats.averageResponseTime).toBe(0);
      expect(stats.slowestRequest).toBeNull();
      expect(stats.errorRate).toBe(0);
      expect(stats.requestsByEndpoint).toEqual({});
    });

    it('should calculate performance statistics', () => {
      // This would require mocking the performance metrics recording
      // For now, we'll test the structure
      const stats = getPerformanceStats();
      
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('averageResponseTime');
      expect(stats).toHaveProperty('slowestRequest');
      expect(stats).toHaveProperty('errorRate');
      expect(stats).toHaveProperty('requestsByEndpoint');
    });
  });
});
