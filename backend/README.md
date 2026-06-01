# BAIO Backend - Express API Server

This is the API server for the Bharat AI Olympiad (BAIO) platform, built on Node.js, Express, and Mongoose (MongoDB Atlas).

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or a local MongoDB database

### Setup Instructions
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template and configure secrets:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Running tests:
   ```bash
   npm test
   ```

## API Structure

- `src/config`: Connection builders (DB, Payment, SMTP).
- `src/constants`: Reusable schemas parameters and static terms.
- `src/controllers`: Request handlers extraction and logic triggers.
- `src/middlewares`: Security filters and route validation blocks.
- `src/models`: Database schema layers.
- `src/routes`: API entry routers map.
- `src/services`: Decoupled business logic implementations.
- `src/validators`: Payload structure validation using Zod.
