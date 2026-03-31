-- Create ENUM types first
CREATE TYPE role_type AS ENUM ('admin', 'recruiter');
CREATE TYPE status_type AS ENUM ('applied', 'interviewing', 'hired', 'rejected');

-- Then create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role role_type, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidates (
  id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, score DECIMAL(5,2), status status_type, recruiter_id INT REFERENCES users(id) ON DELETE SET NULL, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidate_skills (
    id SERIAL PRIMARY KEY, candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE, skill VARCHAR(100)
);