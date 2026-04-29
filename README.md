# Smart Subscription Manager

Smart Subscription Manager is a full-stack SaaS-style application to track subscriptions, renewal alerts, and spending exposure in one place.

## Highlights
- JWT-based authentication with bcrypt password hashing
- Subscription CRUD with service, plan, and category metadata
- Renewal reminders via node-cron
- Email reminders and usage survey emails
- Alerts and notifications with read states

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JWT, bcrypt
- Jobs: node-cron

## Architecture
```mermaid
flowchart LR
  UI[React + Vite + Tailwind] -->|Axios + JWT| API[Node + Express]
  API -->|pg pool| DB[(PostgreSQL)]
  API -->|node-cron| JOBS[Reminder Job]
  JOBS --> DB
```

## Project Structure
```
/client   React app (Vite + Tailwind)
/server   Node API (Express + pg)
```

## Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm 9+

## Local Setup

### 1) Database
Run the SQL in [server/db/schema.sql](server/db/schema.sql) to create tables and seed initial data.

### 2) Backend
Create an environment file in the server folder with the following values:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your_secret_here
PORT=5000
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_FROM=Smart Subscription <no-reply@example.com>
```

Install and run:
```
cd server
npm install
npm run dev
```

### 3) Frontend
Create an environment file in the client folder with the following values:
```
VITE_API_URL=http://localhost:5000
```

Install and run:
```
cd client
npm install
npm run dev
```

## Configuration Notes
- Dashboard numbers are estimates for informational purposes only.
- If your database password contains special characters (like @), URL-encode them.

## Deployment
- Frontend: Vercel (set VITE_API_URL)
- Backend: Render (set DATABASE_URL, JWT_SECRET, FRONTEND_URL)
- Database: Supabase or Railway (PostgreSQL)

## Documentation
- Project overview: [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)

## Authors
- Sahil Sharma
- Samaksh
- Tanishk Jain

## License
MIT
