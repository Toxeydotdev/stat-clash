import { expect, test, type Page } from '@playwright/test';

async function setup(page: Page) {
  await page.goto('/');

  return {
    featuredClash: page.getByRole('region', { name: 'Featured clash' }),
    leftChallenger: page.getByRole('article', { name: 'Left challenger' }),
  };
}

test('shows a real featured comparison', async ({ page }) => {
  const { featuredClash, leftChallenger } = await setup(page);

  await expect(
    page.getByRole('heading', { name: 'Settle the lobby debate.' }),
  ).toBeVisible();
  await expect(featuredClash.getByText('Seeded exhibition data')).toBeVisible();
  await expect(leftChallenger).toContainText('NullByte');
});

test('lets a player swap the arena corners', async ({ page }) => {
  const { featuredClash, leftChallenger } = await setup(page);

  await expect(leftChallenger).toContainText('NullByte');
  await featuredClash.getByRole('button', { name: 'Swap corners' }).click();
  await expect(leftChallenger).toContainText('PixelVex');
});
