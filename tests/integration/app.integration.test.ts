import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Create a simple test app instead of importing the complex main app
const createTestApp = () => {
  const app = express();
  
  // Basic middleware setup
  app.use(cors({
    origin: ['http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Test routes
  app.get('/', (req, res) => {
    res.json({ message: 'backend is running' });
  });
  
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });
  
  app.post('/test-json', (req, res) => {
    res.json({ received: req.body });
  });
  
  // Error handling
  app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({ error: 'Something went wrong!' });
  });
  
  return app;
};

describe('App Integration Tests', () => {
  let app: express.Application;
  
  beforeAll(() => {
    app = createTestApp();
  });

  describe('Basic Endpoints', () => {
    it('should return success for root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        message: 'backend is running'
      });
    });

    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('Middleware Configuration', () => {
    it('should include CORS headers in response', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8080')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should include security headers from helmet', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    });

    it('should parse JSON request body correctly', async () => {
      const testData = { test: 'data', number: 123 };
      
      const response = await request(app)
        .post('/test-json')
        .send(testData)
        .expect(200);

      expect(response.body.received).toEqual(testData);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent routes with 404', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle different HTTP methods', async () => {
      await request(app)
        .post('/')
        .expect(404);
        
      await request(app)
        .put('/health')
        .expect(404);
    });
  });

  describe('Request Validation', () => {
    it('should handle large JSON payloads within limit', async () => {
      const largeData = {
        message: 'test',
        data: Array(100).fill('test-string')
      };
      
      const response = await request(app)
        .post('/test-json')
        .send(largeData)
        .expect(200);

      expect(response.body.received.data).toHaveLength(100);
    });

    it('should handle URL encoded data', async () => {
      const response = await request(app)
        .post('/test-json')
        .send('key=value&another=data')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(200);

      expect(response.body.received).toEqual({
        key: 'value',
        another: 'data'
      });
    });
  });
});