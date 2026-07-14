import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FeaturedComparison } from '@stat-clash/contracts';
import App from './app';

const comparisonFixture: FeaturedComparison = {
  id: 'test-comparison',
  kind: 'exhibition',
  game: {
    id: 'apex-legends',
    name: 'Apex Legends',
    mode: 'Ranked battle royale',
    season: 'Test season',
  },
  players: [
    {
      id: 'nullbyte',
      handle: 'NullByte',
      discriminator: '#0042',
      initials: 'NB',
      rank: 'Master',
      region: 'NA East',
    },
    {
      id: 'pixelvex',
      handle: 'PixelVex',
      discriminator: '#7713',
      initials: 'PV',
      rank: 'Diamond I',
      region: 'EU West',
    },
  ],
  metrics: [
    {
      id: 'kd-ratio',
      label: 'K/D ratio',
      format: 'decimal',
      values: [2.14, 1.97],
    },
  ],
  source: {
    label: 'Seeded exhibition data',
    description: 'Test data',
    capturedAt: '2026-07-13T12:00:00.000Z',
  },
};

interface SetupOptions {
  comparison?: FeaturedComparison;
  failFirstRequest?: boolean;
}

function setup({
  comparison = comparisonFixture,
  failFirstRequest = false,
}: SetupOptions = {}) {
  const user = userEvent.setup();
  const successResponse = {
    json: async () => comparison,
    ok: true,
    status: 200,
  } as Response;
  const fetchMock = vi.fn<typeof fetch>();

  if (failFirstRequest) {
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 503 } as Response)
      .mockResolvedValue(successResponse);
  } else {
    fetchMock.mockResolvedValue(successResponse);
  }

  vi.stubGlobal('fetch', fetchMock);
  render(<App />);

  return { user };
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the product proposition and featured comparison', async () => {
    setup();

    expect(await screen.findByText('Seeded exhibition data')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: /settle the lobby debate/i }),
    ).toBeTruthy();
    expect(screen.getAllByText('NullByte').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PixelVex').length).toBeGreaterThan(0);
  });

  it('swaps the players between arena corners', async () => {
    const { user } = setup();
    await screen.findByText('Seeded exhibition data');

    const leftChallenger = screen.getByRole('article', { name: 'Left challenger' });
    expect(leftChallenger.textContent).toContain('NullByte');
    await user.click(screen.getByRole('button', { name: 'Swap corners' }));

    expect(leftChallenger.textContent).toContain('PixelVex');
  });

  it('lets a user reconnect after the arena feed fails', async () => {
    const { user } = setup({ failFirstRequest: true });

    expect(
      await screen.findByRole('heading', { name: 'Arena feed lost' }),
    ).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Reconnect' }));

    expect(await screen.findByText('Seeded exhibition data')).toBeTruthy();
  });
});
