import * as cronParser from 'cron-parser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CronUtils {
  getNextRunTime(cronExpression: string): Date {
    const interval = cronParser.parseExpression(cronExpression);
    return interval.next().toDate();
  }
  }