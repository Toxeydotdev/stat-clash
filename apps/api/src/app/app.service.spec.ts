import { AppService } from './app.service';

function setup() {
  return { service: new AppService() };
}

describe('AppService', () => {
  describe('getFeaturedComparison', () => {
    it('returns stable player and source metadata', () => {
      const { service } = setup();
      const comparison = service.getFeaturedComparison();

      expect(comparison.players.map(({ handle }) => handle)).toEqual([
        'NullByte',
        'PixelVex',
      ]);
      expect(comparison.source.label).toBe('Seeded exhibition data');
    });
  });
});
