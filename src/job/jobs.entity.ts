// jobs.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobName: string;

  @Column()
  cronExpression: string;

  @Column({ nullable: true })
  lastRunTime: Date;

  @Index()  // Add an index on nextRunTime
  @Column()
  nextRunTime: Date;

  @Column('jsonb')
  jobDetails: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
