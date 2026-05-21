# Smart Recruitment Analytics Platform

A full-stack recruitment analytics platform where recruiters can manage candidates, track scores and skills, visualize hiring analytics, and get ML-based hire probability predictions.

Built as a portfolio project targeting placements at companies like Persistent, Cybage, Zensar, and IBM.

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | HTML, CSS, JavaScript               |
| Backend      | Node.js + Express                   |
| Database     | PostgreSQL                          |
| Auth         | JWT + bcrypt                        |
| Charts       | Chart.js                            |
| ML Analytics | Python, Flask, Pandas, scikit-learn |

---

## Features

- **JWT Authentication** — register and login with hashed passwords, tokens expire in 1 day
- **Role-based Access Control** — recruiters see only their own candidates, admins see all
- **Candidate Management** — full CRUD with skills tracking
- **Dashboard Analytics** — total candidates, status breakdown, average score, top skills
- **Chart.js Visualizations** — bar chart and doughnut chart on the dashboard
- **ML Hire Prediction** — Python Flask service runs logistic regression on candidate scores and returns hire probability percentage

---

## Project Structure

```
smart-recruitment-analytics-platform/
├── client/
│   ├── index.html              # Login / Register page
│   ├── html/
│   │   ├── dashboard.html      # Analytics dashboard
│   │   └── candidates.html     # Candidate management
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── login.js
│       ├── dashboard.js
│       └── candidates.js
│
├── server/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── auth.js             # Register, login
│   │   ├── candidate.js        # CRUD + predict proxy
│   │   └── analytics.js        # Aggregate SQL queries
│   ├── db/
│   │   └── schema.sql          # Tables: users, candidates, candidate_skills
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── role.js             # Role-based route protection
│   ├── routes/
│   │   ├── auth.js
│   │   ├── candidates.js
│   │   └── analytics.js
│   ├── .env                    # Environment variables (not committed)
│   └── server.js
│
└── analytics/
    ├── app.py                  # Flask ML service
    ├── requirements.txt
    └── venv/                   # Not committed
```

---

## Database Schema

**users**

- `id`, `name`, `email`, `password` (bcrypt), `role` (ENUM: admin/recruiter), `created_at`, `updated_at`

**candidates**

- `id`, `name`, `email`, `score`, `status` (ENUM: applied/interviewing/hired/rejected), `recruiter_id` (FK → users), `created_at`, `updated_at`
- If recruiter deleted → `recruiter_id` set to NULL

**candidate_skills**

- `id`, `candidate_id` (FK → candidates CASCADE), `skill`
- If candidate deleted → skills deleted automatically

---

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.11+
- PostgreSQL running on your machine

### 1. Clone the repository

```bash
git clone https://github.com/Shreyasoma/smart-recruitment-analytics-platform
cd smart-recruitment-analytics-platform
```

### 2. Set up the database

```bash
psql -U postgres -p 5433
CREATE DATABASE smart_recruitment_db;
\c smart_recruitment_db
\i 'path/to/server/db/schema.sql'
```

### 3. Configure environment variables

Create a `.env` file inside `server/`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=smart_recruitment_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### 4. Install and run the Node.js backend

```bash
cd server
npm install
node server.js
```

### 5. Set up and run the Python analytics service

```bash
cd analytics
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python app.py
```

### 6. Open the frontend

Open `client/index.html` in your browser directly, or serve it with Live Server.

---

## API Endpoints

### Auth

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login and receive JWT |

### Candidates (protected)

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/api/candidates`             | Get all candidates (role-filtered) |
| POST   | `/api/candidates`             | Add a new candidate                |
| GET    | `/api/candidates/:id`         | Get candidate by ID                |
| PUT    | `/api/candidates/:id`         | Update candidate                   |
| DELETE | `/api/candidates/:id`         | Delete candidate                   |
| POST   | `/api/candidates/:id/predict` | Get ML hire probability            |

### Analytics (protected)

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/analytics` | Get aggregate stats |

### ML Service (Flask — port 5001)

| Method | Endpoint   | Description                                |
| ------ | ---------- | ------------------------------------------ |
| GET    | `/health`  | Health check                               |
| POST   | `/predict` | Predict hire probability for a given score |

---

## ML Prediction

The analytics service trains a logistic regression model on existing `hired` and `rejected` candidates using their scores. Given a score input, it returns:

```json
{
  "score": 75,
  "hire_probability": 76.08,
  "prediction": "hired"
}
```

The Node.js backend proxies this through `POST /api/candidates/:id/predict`, fetching the candidate's score from PostgreSQL and forwarding it to Flask.
