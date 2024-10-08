import { IsNotEmpty, IsString, IsJSON } from 'class-validator';
import { IsCronExpression } from '../custom-validation/Iscron-expression';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({
    description: 'The name of the job',
    example: 'Daily Data Backup',
  })
  @IsNotEmpty()
  @IsString()
  jobName: string;

  @ApiProperty({
    description: 'Cron expression for scheduling the job',
    example: '0 0 * * *', 
  })
  @IsNotEmpty()
  @IsString()
  @IsCronExpression({ message: 'cronExpression must be a valid cron expression' })
  cronExpression: string;

  @ApiProperty({
    description: 'Details related to the job in JSON format',
    type: 'object', 
    example: {
      key: 'value',
      anotherKey: 'anotherValue',
    },
  })
  @IsJSON()
  jobDetails: any;
}
