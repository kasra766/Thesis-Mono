import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  findHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }
}
