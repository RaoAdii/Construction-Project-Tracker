# Project Implementation

## Overview

This project is a construction management dashboard built with:

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB with Mongoose

The application is designed to manage construction projects, consultants, materials, labour usage, and admin oversight.

## Project Structure

```text
construction-app/
  backend/
    data/
      consultants/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
  frontend/
    src/
      components/
      context/
      lib/
      pages/
  README.md
  implementation.md
```

## Setup Steps

### Prerequisites

Before running the project, make sure these are installed:

- Node.js
- npm
- MongoDB

### 1. Open the project

Move into the project folder:

```bash
cd construction-app
```

### 2. Configure backend environment

Create a backend environment file from the example:

```bash
cd backend
copy .env.example .env
```

Update the values inside `backend/.env`.

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/construction_dashboard
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start MongoDB

Make sure your MongoDB server is running locally before starting the backend.

### 5. Run the backend server

```bash
cd backend
npm run dev
```

The backend API should run on:

`http://localhost:5000`

### 6. Configure frontend environment

Create a frontend environment file from the example:

```bash
cd frontend
copy .env.example .env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Install frontend dependencies

```bash
cd frontend
npm install
```

### 8. Run the frontend

```bash
cd frontend
npm run dev
```

The frontend should run on:

`http://localhost:5173`

### 9. Login options

#### Regular user

- Register from the registration page
- Create a normal project account

#### Admin user

- Use the hardcoded admin login path configured in the backend
- Admin can access all projects and the admin portal

### 10. Consultant seed files

Consultant sample JSON files are located in:

`backend/data/consultants/`

These files are not automatically imported yet, but they are ready for a seed/import script.

## Backend Implementation

The backend uses Express for API routing and Mongoose for MongoDB models.

### Main responsibilities

- authentication and login
- hardcoded admin login support
- project CRUD
- consultant CRUD
- role-based access control
- material usage logging
- project visibility rules

### Access rules

- Admin can view all projects
- Normal users can only view projects created by them

### Main backend modules

- `src/controllers/authController.js`
  Handles register, login, hardcoded admin login, and current-user lookup
- `src/controllers/projectController.js`
  Handles project listing, detail, update, creation, and material usage
- `src/controllers/consultantController.js`
  Handles consultant listing and creation
- `src/controllers/dashboardController.js`
  Builds dashboard summary data
- `src/middleware/auth.js`
  Verifies JWT tokens and supports the hardcoded admin session

## Frontend Implementation

The frontend is a React single-page app using React Router.

### Main responsibilities

- login and registration
- user/admin login mode selection
- dashboard summary
- admin portal
- consultant listing and creation
- project creation and editing
- project detail with material tracking

### Main frontend modules

- `src/pages/LoginPage.jsx`
  Handles user/admin login mode UI
- `src/pages/DashboardPage.jsx`
  Shows summary cards and recent projects
- `src/pages/AdminProjectsPage.jsx`
  Shows the admin portal with all projects
- `src/pages/ProjectsPage.jsx`
  Shows the logged-in user's project list
- `src/pages/ProjectDetailPage.jsx`
  Shows project details, remaining materials, pie charts, and daily usage entry
- `src/pages/ProjectFormPage.jsx`
  Handles project creation and editing
- `src/pages/ConsultantsPage.jsx`
  Handles consultant listing and addition

## Data Model Summary

### User

- username
- email
- passwordHash
- fullName
- jobTitle
- role

### Consultant

- fullName
- shortName
- description

### Project

- project identity and status
- consultant reference
- employer
- contract amount
- dates and duration
- createdBy
- followers
- materials
- usage log

## Material Tracking

Material tracking is implemented inside the project model.

Tracked items:

- cement
- bricks
- steel bars
- other materials

Each project also stores a `usageLog` with:

- date
- quantities used
- labour charge
- note

The frontend calculates and displays:

- remaining material totals
- text summaries
- per-material pie chart views

## Admin Portal

The admin portal is separated from the normal dashboard.

### Admin capabilities

- view all projects
- see portfolio-wide status metrics
- navigate to any project

### Admin authentication

The project currently supports a hardcoded admin login path in the backend.

## Consultant Seed Data

Consultant sample JSON files are stored here:

`backend/data/consultants/`

These can be used later for import or seed scripts.

## Current Notes

- Notifications and email service were removed
- Django code was removed from the active implementation
- MongoDB is the only database used
- The app currently uses role-based project visibility

## Suggested Next Improvements

- add consultant import script
- add user assignment to projects
- add project deletion/archive flow
- add budget and cost analytics
- add image upload for site progress
