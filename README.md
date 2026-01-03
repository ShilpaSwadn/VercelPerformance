# Vercel Performance Test App

A comprehensive performance testing application built with Next.js for testing authentication systems, user management, and API performance under load.

## 🚀 Features

- **User Authentication Testing**: Test login functionality with JWT tokens
- **Bulk User Generation**: Generate thousands of test users programmatically
- **CSV Export**: Export test users for JMeter performance testing
- **Real-time User Management**: View and manage test users through a web interface
- **Database Integration**: PostgreSQL with Supabase for scalable data storage
- **Performance Monitoring**: Built for high-concurrency testing scenarios

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: React Icons

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/swadnsaravanan/VercelPerformanceTestAPP.git
   cd VercelPerformanceTestAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=your_supabase_connection_string

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Usage

### Testing Login Performance

1. **Generate Test Users**: Use the "Generate Users" button to create bulk test accounts
2. **Export for JMeter**: Download CSV files for load testing with JMeter
3. **Test Authentication**: Use the login form to test authentication flows
4. **Monitor Performance**: Track response times and success rates

### API Endpoints

- `POST /api/admin/generate-users` - Generate bulk test users
- `GET /api/admin/export-users` - Export users as CSV
- `GET /api/admin/users` - Fetch test users list
- `POST /api/auth/login` - User authentication

### Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string
3. Copy the connection string and update your `.env.local`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |

### Database Connection

The app supports both direct PostgreSQL connections and Supabase connection pooling for optimal performance in serverless environments.

## 📈 Performance Testing

### With JMeter

1. Generate test users using the web interface
2. Export users as CSV
3. Import CSV into JMeter for load testing
4. Configure JMeter to use the exported credentials

### Load Testing Scenarios

- Concurrent user logins
- API endpoint stress testing
- Database connection pooling validation
- JWT token validation performance

## 🏗️ Project Structure

```
VercelPerformanceTestAPP/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── generate-users/
│   │   │   │   ├── export-users/
│   │   │   │   └── users/
│   │   │   └── auth/
│   │   │       └── login/
│   │   ├── login-test/
│   │   │   └── page.jsx
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   └── lib/
│       ├── api/
│       ├── auth/
│       ├── server/
│       │   ├── config/
│       │   ├── middleware/
│       │   ├── models/
│       │   └── services/
│       └── utils/
├── public/
├── .env.local
├── package.json
├── next.config.mjs
├── jsconfig.json
├── postcss.config.mjs
└── README.md
```

