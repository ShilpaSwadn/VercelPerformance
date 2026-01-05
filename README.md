# Performance Test App

A Next.js application for performance testing login functionality with user generation and export capabilities.

## Features

- **Login Test Page**: Interactive page to test login with generated test users
- **Generate Users**: API to generate performance test users in bulk
- **Export Users**: Export test users as CSV for JMeter testing
- **User Management**: Fetch and display test users

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/admin/users` - Fetch test users
- `POST /api/admin/generate-users` - Generate test users
- `GET /api/admin/export-users` - Export users as CSV
- `POST /api/auth/login` - Login endpoint

## Usage

1. Navigate to `/login-test`
2. Generate test users using the "Generate Users" button
3. Use the login form to test authentication
4. Export users as CSV for JMeter testing

## Database

The app uses PostgreSQL and automatically creates the necessary tables on first run.