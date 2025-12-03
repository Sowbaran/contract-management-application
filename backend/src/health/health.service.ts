import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
    };
  }

  ping() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
