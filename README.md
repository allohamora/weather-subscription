# Weather Subscription

a weather subscription app.

[![build](https://github.com/allohamora/weather-subscription/actions/workflows/build.yml/badge.svg?event=push)](https://github.com/allohamora/weather-subscription/actions/workflows/build.yml)
[![test](https://github.com/allohamora/weather-subscription/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/allohamora/weather-subscription/actions/workflows/test.yml)

## Overview

This application is built with:

- [Hono](https://hono.dev/) for the API server
- [Drizzle ORM](https://orm.drizzle.team/) for database operations
- [Croner](https://github.com/hexagon/croner) for scheduling periodic weather updates

## Prerequisites

Before running the application, you'll need:

- Node.js (v22 or higher recommended)
- npm
- Docker and Docker Compose (for running PostgreSQL)
- A domain for email sending

## Setup Weather API

1. Go to [Weather API](https://www.weatherapi.com/)
2. Register an account
3. Create an API key
4. You'll add this key to your `.env` file in the installation steps

## Setup Email Sending

1. Purchase a domain on [Google Cloud DNS](https://cloud.google.com/dns) or another provider
2. Go to [Resend](https://resend.com/)
3. Register an account
4. Follow the instructions to set up your domain for email sending
5. Create an API key
6. You'll add this key to your `.env` file in the installation steps

## Installation & Running the App

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from the template:

   ```bash
   cp .env.example .env
   ```

4. Fill the `.env` file with your API keys and configuration

5. Start the required services with Docker:

   ```bash
   docker compose up -d
   ```

6. Run the application in development mode:

   ```bash
   npm run dev
   ```

7. Access the application:
   - Subscribe form: [http://localhost:3000](http://localhost:3000)
   - Swagger API documentation: [http://localhost:3000/swagger](http://localhost:3000/swagger)

## Database Management

Database migrations are automatically run when the application starts.

To generate a new migration after schema changes:

```bash
npm run migrations:generate
```

## Testing

The project includes end-to-end tests. Run them with:

```bash
npm run test
```

## Project Architecture & Design Decisions

### Project Goal

This project implements a weather subscription service following the contract defined in the [swagger.yaml](https://github.com/mykhailo-hrynko/se-school-5/blob/c05946703852b277e9d6dcb63ffd06fd1e06da5f/swagger.yaml) and addressing the requirements in the [README.md](https://github.com/mykhailo-hrynko/se-school-5/blob/c05946703852b277e9d6dcb63ffd06fd1e06da5f/README.md).

### JWT for Subscription Management

This application uses JWT tokens rather than storing inactive subscriptions in the database for several reasons:

1. **Reduced Database Overhead**: Prevents storing temporary data in the database
2. **Improved Developer Experience**: Simplifies subscription management
3. **Stateless Verification**: Subscriptions can be verified without database queries

The JWT contains all necessary information for subscription creation, and if a user wants to resubscribe after the verification period (10 minutes), a new token is simply generated.

For more robust production environments, a Redis-based token store with TTL could be implemented, but this would add unnecessary complexity for this project.

### Scheduling with Croner vs. Message Queues

The application uses [Croner](https://github.com/hexagon/croner) for scheduling weather updates instead of a message queue system because:

1. **Simplified Timing**: Weather updates are sent at fixed intervals (hourly/daily) or not at all
2. **User Expectations**: Attempting to retry failed email deliveries could create confusing timing for users
3. **Reduced Complexity**: In-memory scheduling is simpler to implement and maintain

For applications requiring more robust retry mechanisms and scalability, a message queue system like BullMQ would be more appropriate, but this would introduce unnecessary complexity for this project's requirements.
