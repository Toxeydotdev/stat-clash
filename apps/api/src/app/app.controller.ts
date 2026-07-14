import { Controller, Get } from '@nestjs/common';
import type { FeaturedComparison, HealthResponse } from '@stat-clash/contracts';
// oxlint-disable-next-line typescript/consistent-type-imports -- Nest needs the runtime class for emitted DI metadata.
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }

  @Get('comparisons/featured')
  getFeaturedComparison(): FeaturedComparison {
    return this.appService.getFeaturedComparison();
  }
}
