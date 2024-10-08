// jobs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './jobs.entity';
import { JobsRepository } from './jobs.repository';
import { CronUtils } from './utils/cron.utils'; 
import { Scheduler } from './utils/sheduler';
import { MyLogger } from 'src/common/logs/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository, CronUtils, Scheduler, MyLogger],
})
export class JobsModule {}
