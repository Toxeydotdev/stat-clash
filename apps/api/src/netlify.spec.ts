import type { HandlerResponse } from '@netlify/aws-lambda-compat';
import { createServerlessApi } from './netlify';

function createEvent(path: string) {
  return {
    body: null,
    headers: { host: 'stat-clash.netlify.app' },
    httpMethod: 'GET',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path,
    queryStringParameters: null,
    rawQuery: '',
    rawUrl: `https://stat-clash.netlify.app${path}`,
  };
}

async function setup() {
  const api = await createServerlessApi();

  return {
    close: api.close,
    get: async (path: string) =>
      (await api.handler(createEvent(path), {})) as HandlerResponse,
  };
}

describe('Netlify API adapter', () => {
  it('serves the health route through Nest', async () => {
    const { close, get } = await setup();

    try {
      const response = await get('/api/health');

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body ?? '')).toEqual({
        service: 'stat-clash-api',
        status: 'ok',
      });
    } finally {
      await close();
    }
  });

  it('serves the exhibition comparison through Nest', async () => {
    const { close, get } = await setup();

    try {
      const response = await get('/api/comparisons/featured');
      const body = JSON.parse(response.body ?? '') as {
        kind: string;
        players: unknown[];
      };

      expect(response.statusCode).toBe(200);
      expect(body.kind).toBe('exhibition');
      expect(body.players).toHaveLength(2);
    } finally {
      await close();
    }
  });

  it('keeps unknown API routes inside the Nest boundary', async () => {
    const { close, get } = await setup();

    try {
      const response = await get('/api/missing');

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body ?? '')).toMatchObject({
        error: 'Not Found',
        statusCode: 404,
      });
    } finally {
      await close();
    }
  });
});
