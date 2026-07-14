import { AppController } from './app.controller';
import { AppService } from './app.service';

function setup() {
  const service = new AppService();
  return { controller: new AppController(service) };
}

describe('AppController', () => {
  describe('getHealth', () => {
    it('reports a healthy service', () => {
      const { controller } = setup();

      expect(controller.getHealth()).toEqual({
        service: 'stat-clash-api',
        status: 'ok',
      });
    });
  });

  describe('getFeaturedComparison', () => {
    it('returns the seeded matchup', () => {
      const { controller } = setup();
      const comparison = controller.getFeaturedComparison();

      expect(comparison.kind).toBe('exhibition');
      expect(comparison.players).toHaveLength(2);
      expect(comparison.metrics).toHaveLength(5);
    });
  });
});
