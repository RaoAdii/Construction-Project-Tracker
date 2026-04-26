# Construction Dashboard

This repository now uses a MERN-style stack:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Project Structure

```text
construction-app/
  backend/         Express API, JWT auth, MongoDB models
  frontend/        React SPA for auth and project management
```

## Features Ported Into The New Stack

- User registration and login
- Dashboard summary
- Consultant management API
- Project list/detail/create/update
- Follow and unfollow projects
- MongoDB schemas for the broader construction domain:
  - Users
  - Consultants
  - Projects
  - Schedules
  - Plans
  - Progress reports
  - Payments

## Backend Setup

1. Open `backend/.env.example` and create `backend/.env`.
2. Set your MongoDB connection string and JWT secret.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the React app:

```bash
npm run dev
```

The client runs on `http://localhost:5173` by default and proxies API calls to the backend URL set in `VITE_API_URL`.

## Environment Files

Backend example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/construction_dashboard
JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Notes

- MongoDB is the only database used by the new application.
- Django, SQLite, email service code, and notification code have been removed from the repository.
