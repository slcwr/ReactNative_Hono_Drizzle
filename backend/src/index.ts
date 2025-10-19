import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';
import externalApiRoutes from './routes/external-api.js';
import healthRoutes from './routes/health.js';
import { yoga } from './graphql/index.js';

dotenv.config();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:8080', 'http://localhost:19006', '*'],
  credentials: true,
}));

// GraphQL endpoint
app.use('/graphql', async (c) => {
  const response = await yoga.fetch(c.req.raw, {
    // Pass Hono context to GraphQL Yoga
  });
  return response;
});

// REST API Routes
app.route('/api/external', externalApiRoutes);
app.route('/health', healthRoutes);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Weight Tracker API with Hono + GraphQL',
    version: '1.0.0',
    endpoints: {
      graphql: '/graphql',
      graphiql: '/graphql (open in browser)',
      health: '/health',
      externalApi: '/api/external',
    },
  });
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Hono server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
