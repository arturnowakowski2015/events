# Node.js Backend for CarMonitoring

This directory contains the Node.js backend server for the CarMonitoring project. It provides a REST API for managing incidents and participants, and interacts with a PostgreSQL database.

## Features
- Express.js server with CORS and JSON support
- RESTful API endpoints for incidents and participants
- PostgreSQL integration
- TypeScript for type safety
- Database migration script

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

## Setup
1. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and set your database connection string and other settings.

3. Run database migrations:
   ```sh
   npm run migrate
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```
   The server will start on `http://localhost:8080` by default.

## Scripts
- `npm run dev` — Start server with hot reload (ts-node-dev)
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Start server from compiled output
- `npm run migrate` — Run database migrations

## Project Structure
- `src/`
  - `index.ts` — Main server entry point
  - `controllers/` — Route handlers for API endpoints
  - `services/` — Business logic and database access
  - `db/` — Database migration and connection pool
  - `types/` — Shared TypeScript types

## API Endpoints
- `GET /api/incidents` — List all incidents
- `POST /api/incidents` — Create a new incident
- `GET /api/participants` — List all participants
- `POST /api/participants` — Create a new participant

## License
MIT
