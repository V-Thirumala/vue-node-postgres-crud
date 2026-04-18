# User Management CRUD App

A full-stack mini project for managing users with Create, Read, Update, and Delete operations.

## Tech Stack

- **Frontend:** Vue 3 + Vite + Tailwind CSS + Axios
- **Backend:** Express 5 + PostgreSQL + Node.js

## Prerequisites

- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+)
- [PostgreSQL](https://www.postgresql.org/)

## Database Setup

Create a PostgreSQL database and run:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

Start the server:

```bash
node server.js
```

The backend runs at the port specified in your `.env` file (default: `3000`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` (Default).

## API Endpoints

| Method | Endpoint | Description |
|--------|---------------------|------------------|
| POST | `/adduser` | Create a new user |
| GET | `/getusers` | Get all users |
| PATCH | `/updateuser/:id` | Update a user |
| DELETE | `/deleteuser/:id` | Delete a user |
