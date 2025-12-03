import { Controller, Get, Req } from '@nestjs/common';
import { BypassAuth } from '../decorators';

@Controller('health')
export class HealthController {
  @BypassAuth()
  @Get('ping')
  ping() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @BypassAuth()
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
    };
  }

  @Get('auth-test')
  authTest(@Req() request: any) {
    return {
      status: 'authenticated',
      user: request.user,
      timestamp: new Date().toISOString(),
    };
  }
}
