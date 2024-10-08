# Job Scheduler

## Overview

This project implements a job scheduling system using NestJS and PostgreSQL. It provides functionality to create, manage, and execute jobs based on cron expressions.
![Screenshot 2024-10-08 150445](https://github.com/user-attachments/assets/21cab4a5-178c-4438-a1c9-27f2aa6bc6b1)

 A[User Request] --> B[Create Job DTO]
    B --> C[Jobs Service]
    C --> D[Save Job]
    D --> E[Reorder Jobs]
    E --> F[Scheduler]
    F --> G[Run Scheduler Loop]
    G --> H[Get Jobs to Run Now]
    H --> I[Execute Job]
    I --> J[Update Job Run Times]
    J --> K[Log Execution]
    K --> L[Sleep Until Next Job]


# Flow Explanation
User Request: The flow starts when a user sends a request to create a job.

Create Job DTO: The request is transformed into a Data Transfer Object (DTO), which includes validation checks (e.g., cron expression format).

Jobs Service: The JobsService handles the logic related to jobs and processes the DTO.

Save Job: The job is saved to the database using the repository pattern, where it is stored in the PostgreSQL database.

Reorder Jobs: After saving, the Reorder Jobs function is called to ensure that all jobs are ordered correctly based on their next run time.

Scheduler: The scheduler is initialized and starts running in a loop.

Run Scheduler Loop: The scheduler continuously runs, checking for jobs that need to be executed.

Get Jobs to Run Now: The scheduler fetches jobs that are scheduled to run at the current time.

Execute Job: Each job that needs to be run is executed.

Update Job Run Times: After execution, the job's run times (last run time and next run time) are updated.

Log Execution: The execution details are logged for monitoring purposes.

Sleep Until Next Job: The scheduler sleeps until it's time to run the next job, thus managing resource utilization.

Getting Started
To run this project locally, follow these steps:

Clone the repository.
Install the necessary dependencies.
Set up the PostgreSQL database as specified in the docker-compose.yml.
Run the application.
Use the API endpoints to manage jobs.

# Features
swagger docs : localhost:$port/api/jobs
Exception Handling
Dockerization docker-compose file
logs: logging actions in console and save it in file combined.log to can auditing

# scaling and mentainance
Architecture Overview
Separation of Concerns:

Create two distinct services:
Job Service: Responsible for fetching jobs from the database and sending them to a message broker (e.g., RabbitMQ).
Scheduler Service: Responsible for receiving messages from the message broker and executing the jobs.
Using a Message Broker:

Use RabbitMQ (or any message broker) to decouple the Job Service from the Scheduler Service. This allows you to scale both services independently.
Using Redis for State Management:

Utilize Redis as a cache or state management solution to maintain the status of jobs. This will help you avoid re-processing jobs that have already been executed.
You can store job identifiers in Redis to ensure that each job is processed only once.
Handling Event Delivery:

Ensure that events (like sending an email) are processed only once. Implement idempotency in your job processing logic.
Use Redis to check if a job has already been processed before executing it. Store the job IDs in Redis with a TTL (Time-to-Live) to manage memory effectively.
Scaling the Services:

Deploy multiple instances of both the Job Service and Scheduler Service to handle increased load.
Ensure that only one instance of the Scheduler Service processes a job at a time to prevent duplicate executions.