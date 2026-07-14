import { Injectable } from '@nestjs/common';
import type { FeaturedComparison, HealthResponse } from '@stat-clash/contracts';

@Injectable()
export class AppService {
  private readonly featuredComparison: FeaturedComparison = {
    id: 'apex-exhibition-001',
    kind: 'exhibition',
    game: {
      id: 'apex-legends',
      name: 'Apex Legends',
      mode: 'Ranked battle royale',
      season: 'Exhibition build',
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
      {
        id: 'win-rate',
        label: 'Win rate',
        format: 'percent',
        values: [18.6, 21.3],
      },
      {
        id: 'average-damage',
        label: 'Avg. damage',
        format: 'integer',
        values: [742, 689],
      },
      {
        id: 'top-five-rate',
        label: 'Top 5 rate',
        format: 'percent',
        values: [41.8, 37.4],
      },
      {
        id: 'revives',
        label: 'Squad revives',
        format: 'integer',
        values: [126, 153],
      },
    ],
    source: {
      label: 'Seeded exhibition data',
      description:
        'A deterministic fixture used while live provider adapters are designed.',
      capturedAt: '2026-07-13T12:00:00.000Z',
    },
  };

  getHealth(): HealthResponse {
    return { service: 'stat-clash-api', status: 'ok' };
  }

  getFeaturedComparison(): FeaturedComparison {
    return this.featuredComparison;
  }
}
