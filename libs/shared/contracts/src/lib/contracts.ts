export type MetricFormat = 'decimal' | 'integer' | 'percent';

export interface PlayerProfile {
  id: string;
  handle: string;
  discriminator: string;
  initials: string;
  rank: string;
  region: string;
}

export interface ComparisonMetric {
  id: string;
  label: string;
  format: MetricFormat;
  values: [number, number];
}

export interface FeaturedComparison {
  id: string;
  kind: 'exhibition';
  game: {
    id: string;
    name: string;
    mode: string;
    season: string;
  };
  players: [PlayerProfile, PlayerProfile];
  metrics: ComparisonMetric[];
  source: {
    label: string;
    description: string;
    capturedAt: string;
  };
}

export interface HealthResponse {
  service: 'stat-clash-api';
  status: 'ok';
}
