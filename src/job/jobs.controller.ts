import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job-dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get all jobs' })
  async getAllJobs() {
    return this.jobsService.getAllJobs();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get job by ID' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Create a new job' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.createJob(createJobDto);
  }
}
