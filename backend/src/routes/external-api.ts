import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, apiLogs } from '../db';

const app = new Hono();

// Example: Webhook schema for validating incoming requests
const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
});

// Example: External API integration - webhook receiver
app.post('/webhook', zValidator('json', webhookSchema), async (c) => {
  const body = c.req.valid('json');

  try {
    // Log the webhook request
    await db.insert(apiLogs).values({
      endpoint: '/api/external/webhook',
      method: 'POST',
      statusCode: 200,
      requestBody: JSON.stringify(body),
      responseBody: JSON.stringify({ success: true }),
    });

    // Process webhook data here
    console.log('Received webhook:', body);

    return c.json({
      success: true,
      message: 'Webhook received',
      event: body.event,
    });
  } catch (error) {
    // Log error
    await db.insert(apiLogs).values({
      endpoint: '/api/external/webhook',
      method: 'POST',
      statusCode: 500,
      requestBody: JSON.stringify(body),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Example: Call external API and store data
app.get('/fetch-data', async (c) => {
  const externalApiUrl = 'https://api.example.com/data'; // Replace with actual API

  try {
    // Simulate external API call
    // In production, use fetch() or axios
    const mockData = {
      id: 1,
      message: 'This is mock data from external API',
      timestamp: new Date().toISOString(),
    };

    // Log the API call
    await db.insert(apiLogs).values({
      endpoint: externalApiUrl,
      method: 'GET',
      statusCode: 200,
      responseBody: JSON.stringify(mockData),
    });

    return c.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    // Log error
    await db.insert(apiLogs).values({
      endpoint: externalApiUrl,
      method: 'GET',
      statusCode: 500,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Example: Sync data to external service
const syncSchema = z.object({
  userId: z.number(),
  action: z.enum(['create', 'update', 'delete']),
  data: z.record(z.any()),
});

app.post('/sync', zValidator('json', syncSchema), async (c) => {
  const body = c.req.valid('json');
  const externalApiUrl = 'https://api.example.com/sync'; // Replace with actual API

  try {
    // Simulate external API call
    // In production, use fetch() with proper authentication
    const mockResponse = {
      success: true,
      syncedAt: new Date().toISOString(),
    };

    // Log the API call
    await db.insert(apiLogs).values({
      endpoint: externalApiUrl,
      method: 'POST',
      statusCode: 200,
      requestBody: JSON.stringify(body),
      responseBody: JSON.stringify(mockResponse),
    });

    return c.json({
      success: true,
      message: 'Data synced successfully',
      result: mockResponse,
    });
  } catch (error) {
    // Log error
    await db.insert(apiLogs).values({
      endpoint: externalApiUrl,
      method: 'POST',
      statusCode: 500,
      requestBody: JSON.stringify(body),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Get API logs for monitoring
app.get('/logs', async (c) => {
  try {
    const logs = await db
      .select()
      .from(apiLogs)
      .orderBy(apiLogs.createdAt)
      .limit(50);

    return c.json({
      success: true,
      logs,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

export default app;
