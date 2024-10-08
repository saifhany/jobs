// jobs.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JobsRepository } from './jobs.repository';
import { Job } from './jobs.entity';
import { CronUtils } from './utils/cron.utils';
import { CreateJobDto } from './dto/create-job-dto';
import { Scheduler } from '../job/utils/sheduler'; 

@Injectable()
export class JobsService {
  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly cronUtils: CronUtils,
    private readonly scheduler: Scheduler, 
  ) {}

  async getAllJobs(): Promise<Job[]> {
    return this.jobsRepository.findAll();
  }

  async getJobById(id: string): Promise<Job> {
    try{
    const job = await this.jobsRepository.findOne(id);
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }catch(err){
   throw new HttpException('Error getting job', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    try {
    const job = new Job();
    job.cronExpression = createJobDto.cronExpression;
    job.jobDetails = createJobDto.jobDetails; 
    job.jobName = createJobDto.jobName; 
    job.nextRunTime = this.cronUtils.getNextRunTime(job.cronExpression);
    await this.scheduler.reorderJobs();
    return this.jobsRepository.save(job);
       // Trigger the scheduler to reorder jobs
    } catch (error) {
      throw new HttpException(
        `Error creating job: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getJobsToRunNow(): Promise<Job[]> {
    return this.jobsRepository.findJobsToRunNow();
  }

  async getNextJob(): Promise<Job> {
    const nextJob = await this.jobsRepository.findNextJob();
    if (!nextJob) {
      throw new HttpException('No next job found', HttpStatus.NOT_FOUND);
    }
    return nextJob;
  }

  async updateJobRunTimes(job: Job) {
    try {
      job.lastRunTime = new Date();
      job.nextRunTime = this.cronUtils.getNextRunTime(job.cronExpression);
      await this.jobsRepository.save(job);
    } catch (error) {
      throw new HttpException(
        `Error updating job run times: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
