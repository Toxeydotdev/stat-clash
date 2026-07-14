import { expect, test, type Page } from '@playwright/test';

const isDeploymentValidation = process.env['DEPLOYMENT_E2E'] === 'true';

async function setup(page: Page) {
  const response = await page.goto('/arena/history');

  return {
    heading: page.getByRole('heading', { name: 'Settle the lobby debate.' }),
    response,
  };
}

test('serves the arena through the browser fallback', async ({ page }) => {
  const { heading, response } = await setup(page);

  expect(response?.status()).toBe(200);
  await expect(heading).toBeVisible();
  await expect(page.getByRole('region', { name: 'Featured clash' })).toContainText(
    'Seeded exhibition data',
  );
});

test('keeps deployed API responses inside the Nest boundary', async ({ request }) => {
  const healthResponse = await request.get('/api/health');
  const featuredResponse = await request.get('/api/comparisons/featured');
  const missingResponse = await request.get('/api/missing');

  expect(healthResponse.status()).toBe(200);
  await expect(healthResponse.json()).resolves.toEqual({
    service: 'stat-clash-api',
    status: 'ok',
  });

  expect(featuredResponse.status()).toBe(200);
  await expect(featuredResponse.json()).resolves.toMatchObject({
    kind: 'exhibition',
    players: [{ handle: 'NullByte' }, { handle: 'PixelVex' }],
  });

  expect(missingResponse.status()).toBe(404);
  expect(missingResponse.headers()['content-type']).toContain('application/json');
  await expect(missingResponse.json()).resolves.toMatchObject({
    error: 'Not Found',
    statusCode: 404,
  });
});

test('serves production assets with immutable caching', async ({ request }) => {
  test.skip(
    !isDeploymentValidation,
    'Immutable CDN headers exist only on a deployed Netlify site.',
  );

  const documentResponse = await request.get('/');
  const document = await documentResponse.text();
  const assetPath = document.match(/\/assets\/[^"']+/)?.[0];

  expect(documentResponse.status()).toBe(200);
  expect(assetPath).toBeDefined();

  const assetResponse = await request.get(assetPath ?? '');
  const cacheControl = assetResponse.headers()['cache-control'];

  expect(assetResponse.status()).toBe(200);
  expect(cacheControl).toContain('max-age=31536000');
  expect(cacheControl).toContain('immutable');
});

test('publishes an uncached deployment identity', async ({ request }) => {
  test.skip(
    !isDeploymentValidation,
    'Deployment identity exists only in a production build.',
  );

  const response = await request.get('/deployment.json');
  const cacheControl = response.headers()['cache-control'];

  expect(response.status()).toBe(200);
  expect(cacheControl).toContain('no-store');
  await expect(response.json()).resolves.toEqual({
    commit: expect.stringMatching(/^(?:[0-9a-f]{40}|local)$/),
  });
});
