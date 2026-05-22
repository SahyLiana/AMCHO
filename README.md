# AMCHO — Cocoa & Chocolate Analytics Platform

A full-stack data analytics platform that ingests global cocoa prices and U.S. chocolate manufacturing PPI data from CSV sources into PostgreSQL, then serves interactive dashboards via a REST API.
In this Web app, there is select option dropdown where you can select different range of years.

---

## Architecture

```
CSV Data Sources
     │
     ▼
Python ETL Pipeline  ──►  PostgreSQL Database  ◄──  Express API (port 5000)
(pipeline.py)                                    │
                                                  ▼
                                          React Dashboard (port 5173)
```

---

## Tech Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| **ETL**      | Python, Pandas, SQLAlchemy, psycopg2                      |
| **Database** | PostgreSQL                                                |
| **Backend**  | Node.js, Express, Prisma ORM, JWT, bcrypt                 |
| **Frontend** | React 19, Vite, Tailwind CSS v4, ApexCharts, Lucide Icons |

---

## Database Schema

Two tables and one analytical view in a PostgreSQL database named `amcho`:

### `global_cocoa_prices`

| Column              | Type            | Description                       |
| ------------------- | --------------- | --------------------------------- |
| `observation_date`  | `DATE` (PK)     | Date of observation               |
| `price_usd_per_ton` | `NUMERIC(12,4)` | Global cocoa price in USD per ton |

### `chocolate_ppi`

| Column             | Type           | Description                                       |
| ------------------ | -------------- | ------------------------------------------------- |
| `observation_date` | `DATE` (PK)    | Date of observation                               |
| `ppi_index`        | `NUMERIC(8,3)` | U.S. chocolate manufacturing Producer Price Index |

### `User` (Prisma-only, for authentication)

| Column      | Type                      | Description            |
| ----------- | ------------------------- | ---------------------- |
| `id`        | `INT` (PK, autoincrement) | User ID                |
| `username`  | `VARCHAR` (unique)        | Login username         |
| `password`  | `VARCHAR`                 | bcrypt-hashed password |
| `createdAt` | `TIMESTAMP`               | Account creation date  |

---

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL running locally on port 5432

### 1. Clone the project

```bash
git clone https://github.com/SahyLiana/AMCHO.git
```

### 1. Create the Database

```bash
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE amcho;"
```

### 2. Run the ETL Pipeline

```bash
# Install Python dependencies
pip install pandas sqlalchemy psycopg2-binary python-dotenv

# Run the orchestrator to create tables, views, and ingest CSV data
python pipeline.py
```

### 4. Start the Backend API

```bash
cd amcho-backend

# Install Node.js dependencies
npm install

# Push Prisma schema to PostgreSQL (syncs models)
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed default users (admin/staff)
npx prisma db seed

# Start the Express API server on port 5000
npm run dev
```

### 5. Start the Frontend

```bash
cd amcho-frontend

# Install dependencies
npm install

# Start the Vite dev server on port 5173
npm run dev
```

---

## Default Credentials

| Username | Password |
| -------- | -------- |
| `admin`  | `123`    |
| `staff`  | `123`    |

---

## API Endpoints

| Method | Endpoint           | Auth | Description                              |
| ------ | ------------------ | ---- | ---------------------------------------- |
| `POST` | `/api/auth/login`  | No   | Authenticate and receive JWT cookie      |
| `POST` | `/api/auth/logout` | No   | Clear auth cookie                        |
| `GET`  | `/api/auth/me`     | Yes  | Get current user profile                 |
| `GET`  | `/api/cocoa`       | Yes  | Get all analytics data (7 query results) |

### `/api/cocoa` Response

Returns a single JSON object with seven analytical result sets:

1. **cocoaPrice** — Annual average cocoa prices
2. **cocoaPriceChange** — Year-over-year absolute price change
3. **cocoaPriceChangePercentage** — Year-over-year price percentage change
4. **cocoaPPI** — Annual average PPI values
5. **cocoaPPIChange** — Year-over-year PPI absolute change
6. **cocoaPPIChangePercentage** — Year-over-year PPI percentage change
7. **cocoaPPIChangeReferencePercentage** — PPI percentage change relative to 2011 baseline

---

## Data Sources

- `datasources/PCOCOUSDM.csv` — Global cocoa prices (USD per metric ton)
- `datasources/PCU3113513113517.csv` — U.S. chocolate manufacturing PPI (Producer Price Index)

Both datasets are sourced from FRED (Federal Reserve Economic Data).

---

## Project Structure

```
AMCHO/
├── .env                          # Python ETL environment variables
├── pipeline.py                   # ETL orchestration entry point
├── db_config.py                  # SQLAlchemy PostgreSQL connection factory
├── schema.py                     # DDL for tables and analytical view
├── loader.py                     # Idempotent upsert logic
├── requirements.txt              # Python dependencies
├── REQUEST.MD                    # Reference SQL analytics queries
├── datasources/                  # Raw CSV data files
├── amcho-backend/                # Express API server
│   ├── .env
│   ├── server.js                 # Express app entry (port 5000)
│   ├── db.js                     # Prisma client singleton
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma         # Database models (User, cocoa, PPI)
│   │   └── seed.js               # Seeds admin/staff users
│   ├── controllers/
│   │   ├── authController.js     # Login, logout, profile
│   │   └── cocoa.controller.js   # 7 parallel analytics queries
│   ├── routes/
│   │   ├── auth.route.js
│   │   └── cocoa.route.js
│   └── middleware/
│       └── authGuard.js          # JWT cookie verification
└── amcho-frontend/               # React dashboard
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx               # Router: /login, /dashboard, *
        ├── index.css             # Tailwind CSS v4 entry
        ├── pages/
        │   ├── LoginPage.jsx     # Username/password form
        │   └── DashboardPage.jsx # Charts + table + date filter
        └── components/
            ├── Navbar.jsx
            ├── ProtectedRoute.jsx
            └── TableAnalytic.jsx
```
