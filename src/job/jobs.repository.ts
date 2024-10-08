import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './jobs.entity';

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async findJobsToRunNow(): Promise<Job[]> {
    return this.jobRepository
      .createQueryBuilder('job')
      .where('job.nextRunTime <= :now', { now: new Date() })
      .getMany();
  }

  async findNextJob(): Promise<Job> {
    return this.jobRepository
      .createQueryBuilder('job')
      .orderBy('job.nextRunTime', 'ASC')
      .getOne();
  }

  async findJobsAfterNextRunTime(nextRunTime: Date): Promise<Job[]> {
    return this.jobRepository
      .createQueryBuilder('job')
      .where('job.nextRunTime > :nextRunTime', { nextRunTime })
      .orderBy('job.nextRunTime', 'ASC') 
      .getMany();
  }

  async save(job: Job): Promise<Job> {
    return this.jobRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  async findOne(id: string): Promise<Job> {
    return this.jobRepository.findOneBy({ id });
  }
}
