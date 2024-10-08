import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JobsService } from '../jobs.service';
import { Job } from '../jobs.entity';
import { MyLogger } from '../../common/logs/logger.service';
import { CronUtils } from './cron.utils';

@Injectable()
export class Scheduler implements OnModuleInit {
    private isRunning = false;  
    constructor(
    @Inject(forwardRef(() => JobsService))
    private jobsService: JobsService,
    private logger: MyLogger,
    private cronUtils: CronUtils,
    
  ) {}
  onModuleInit() {
    this.runScheduler();  
  }
  async runScheduler() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
        while (true) {
            const jobsToRun = await this.jobsService.getJobsToRunNow();

            for (const job of jobsToRun) { 
                console.log(job, 'Running');
                await this.executeJob(job);
            }

            const nextJob = await this.jobsService.getNextJob();
            const now = Date.now();
            const nextRunTime = nextJob ? nextJob.nextRunTime.getTime() : now + 60000;

            const sleepTime = Math.max(0, nextRunTime - now);
            this.logger.log(`Sleeping for ${sleepTime / 1000} seconds`);
            await this.sleep(sleepTime);
        }
    } catch (error) {
        this.logger.error(`Error executing jobs: ${error.message}`);
    } finally {
        this.isRunning = false;
    }
}

  private async executeJob(job: Job) {
    this.logger.log(`Executing job ${job.id}`);
    try {
      await this.jobsService.updateJobRunTimes(job);
    } catch (error) {
        this.logger.error(`Error executing job ${job.id}: ${error.message}`);
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async reorderJobs() {
    this.logger.log('Reordering jobs...');
    const allJobs = await this.jobsService.getAllJobs();
    for (const job of allJobs) {
      job.nextRunTime = this.cronUtils.getNextRunTime(job.cronExpression);
      await this.jobsService.updateJobRunTimes(job);
    }
    this.logger.log('Jobs reordered successfully');
  }
}
