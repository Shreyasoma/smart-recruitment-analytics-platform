# Smart Recruitment Analytics Platform

A full-stack recruitment analytics platform that helps recruiters manage candidates, track scores and skills, and visualize hiring analytics through an intuitive dashboard.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh tokens) + bcrypt
- **Analytics:** Python (Pandas + Matplotlib)

## Folder Structure

```
smart-recruitment-analytics-platform/
├── client/
│   ├── index.html
│   ├── html/
│   │   ├── dashboard.html
│   │   └── candidates.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   └── candidates.js
│   └── assets/
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── auth.js
    │   └── candidates.js
    ├── db/
    │   └── schema.sql
    ├── middleware/
    │   ├── auth.js
    │   └── role.js
    ├── models/
    │   ├── user.js
    │   └── candidate.js
    ├── routes/
    │   ├── auth.js
    │   └── candidates.js
    ├── .env
    └── server.js
```

## Getting Started

### Prerequisites

- Node.js installed
- PostgreSQL installed and running

### Installation

1. Clone the repository

```
git clone <your-repo-url>
```

2. Install backend dependencies

```
cd server
npm install
```

3. Create your `.env` file inside `server/` and fill in your values

```
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=smart_recruitment_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

4. Set up the database — open psql and run:

```
psql -U postgres -p 5433
CREATE DATABASE smart_recruitment_db;
\c smart_recruitment_db
\i 'path/to/server/db/schema.sql'
```

5. Run the server

```
node server.js
```

You should see:

```
Database connected successfully
Server is running on http://localhost:3000
```

## Database Schema

Three tables power this platform:

- **users** — stores admin and recruiter accounts with hashed passwords and role-based access
- **candidates** — stores candidate profiles with scores, status, and recruiter reference
- **candidate_skills** — stores multiple skills per candidate (one-to-many relationship)

Foreign key rules:

- If a recruiter is deleted → `recruiter_id` on their candidates becomes `NULL`
- If a candidate is deleted → their skills in `candidate_skills` are deleted automatically

## Features

- Role-based authentication (Admin / Recruiter)
- Candidate management with scores and skills
- Dashboard with analytics and charts
- Pagination, filtering, and search
- Analytics export
- ML-based candidate selection probability (bonus)

## Status

🚧 Currently in development — Phase 1 (Foundation)

### Progress

✅ Folder structure
✅ Express server running
✅ Environment variables
✅ Database connected
✅ Database schema
✅ Register endpoint
✅ Login endpoint
✅ Auth middleware
✅ Role middleware
✅ Candidate CRUD
✅ Frontend login page
✅ Frontend candidates page
⬜ Frontend dashboard
