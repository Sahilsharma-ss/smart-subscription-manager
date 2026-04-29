# Smart Subscription Manager - Project Overview

## Purpose
Smart Subscription Manager helps users track all subscriptions in one place, predict upcoming costs, and receive renewal reminders. It also collects a short usage survey to identify subscriptions the user is not using and highlight cost-cutting opportunities.

## Core Features
- User authentication with JWT
- Subscription management (create, edit, delete, list)
- Service, plan, and category metadata
- Dashboard analytics (monthly spend, 30-day exposure, upcoming renewals)
- Renewal alerts with in-app notifications
- Usage survey flow and survey-based unused list
- Email reminders and survey emails via SMTP

## Tech Stack
### Frontend
- React + Vite
- React Router
- Tailwind CSS
- Axios (API client)
- react-hot-toast (notifications)
- Lucide icons

### Backend
- Node.js + Express
- PostgreSQL with pg pool
- JWT auth
- node-cron for scheduled jobs
- nodemailer for SMTP

### Database
- PostgreSQL (Supabase or local)

## High-Level Architecture
- The React app calls the Express API with a JWT token in Authorization headers.
- The API queries PostgreSQL for subscriptions, metadata, and analytics.
- node-cron runs scheduled reminder and survey jobs.
- Emails are sent using nodemailer via SMTP.

## Key User Flows
### 1) Sign up and login
- User registers with name, email, password, and optional phone.
- API issues a JWT token on success.
- Frontend stores the token and uses it for protected routes.

### 2) Manage subscriptions
- User adds a subscription with service, plan, category, price, billing cycle, renewal date.
- Subscriptions can be edited or deleted.
- Dashboard shows summary stats for active subscriptions.

### 3) Renewal reminders
- A daily cron job finds subscriptions renewing within 7 days.
- It creates an alert and a notification.
- It sends a reminder email with a link to manage subscriptions.

### 4) Usage survey
- A weekly cron job sends a usage survey email.
- User opens the in-app survey and marks subscriptions as using or not using.
- Responses are stored in usage_logs with usage_type = 'survey'.
- Dashboard shows a list of subscriptions marked as not using.

## Frontend Structure
- Pages: Landing, Login, Register, Dashboard, Subscriptions, Add Subscription, Edit Subscription, Alerts, Survey
- Components: Navbar, StatCard, SubscriptionTable, AlertCard, Badge, ConfirmModal
- The app uses a protected layout to guard authenticated routes.

## Backend Structure
- Routes
  - /api/auth: login and register
  - /api/subscriptions: CRUD for subscriptions
  - /api/dashboard: analytics summary
  - /api/alerts: alerts and read state
  - /api/metadata: services, plans, categories
  - /api/usage: usage logs + survey submission
- Controllers
  - authController: auth logic
  - subscriptionController: subscription CRUD
  - dashboardController: analytics queries
  - alertController: alert list and read state
  - metadataController: metadata fetch
  - usageLogController: usage logs and survey
- Scheduler
  - reminderJob: daily renewal reminders
  - surveyJob: weekly survey emails

## Data Model Summary
- users: account info, currency, timezone
- categories: subscription categories
- services: service catalog
- subscription_plans: pricing and plan data
- subscriptions: user subscriptions
- alerts: reminder alerts
- notifications: in-app notifications
- usage_logs: usage history and survey responses

## Environment Variables
### Server (.env)
- DATABASE_URL
- JWT_SECRET
- PORT
- FRONTEND_URL
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- SMTP_FROM

### Client (.env)
- VITE_API_URL

## Running Locally
1) Database
- Run the SQL in server/db/schema.sql

2) Backend
- cd server
- npm install
- npm run dev

3) Frontend
- cd client
- npm install
- npm run dev

## Email Configuration
- SMTP is required for reminder and survey emails.
- For Gmail, use an App Password and set SMTP_HOST to smtp.gmail.com.

## Notes and Behavior
- Dashboard values are estimates.
- Survey results are the latest response per subscription.
- Cron schedules run on server time.

## Security
- Passwords are hashed with bcrypt.
- JWT tokens protect API routes.
- CORS is limited by FRONTEND_URL.

## Future Enhancements
- Add savings summary based on survey data
- Add HTML email templates
- Add server-side caching for dashboard metrics
- Add role-based admin views
