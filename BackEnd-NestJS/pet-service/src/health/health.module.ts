import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { PingController } from './ping.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController, PingController],
})
export class HealthModule {}
