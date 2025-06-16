## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- PostgreSQL (v14 or higher)

## Quick Start

1. download PostgreSQL from:

https://www.postgresql.org/download/

2. create a Database :

```bash
# Access the PostgreSQL shell
psql -U postgres

# Inside the shell, create a new database:
CREATE DATABASE kgbBooking;

#  Create a new user with password
CREATE USER kgb_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kgbBooking TO kgb_user;
```

3. Install dependencies:

```bash
pnpm install
```

4. Set up environment variables:

```bash
cp .env.example .env
```

5. Edit your .env file:

```bash
DATABASE_URL="postgresql://kgb_user:your_secure_password@localhost:5432/kgbbooking"
```

6. Initialize the database:

```bash
pnpm db:push
```

7. Start the development server:

```bash
pnpm dev
```

## Project Structure

```
src/
├── lib/                    # Library code
│   ├── components/         # Reusable Svelte components
│   │   ├── server/            # Server-side code
│   │   │   ├── db/            # Database related code
│   │   │   │   ├── repositories/  # Data access layer
│   │   │   │   └── schema.ts      # Database schema definitions
│   │   │   ├── services/          # Business logic layer
│   │   │   ├── types/             # TypeScript type definitions
│   │   │   └── utils/             # Utility functions
│   │   └── routes/                # SvelteKit routes
│   │       ├── (protected)/       # Protected routes (require authentication)
│   │       └── (public)/         # Public routes
│   └──
```

## Architecture

### Layer Overview

1. **Repository Layer** (`/lib/server/db/repositories/`)
   - Direct database interactions
   - Raw SQL queries and data mapping
     │ │ └── schema.ts # Database schema definitions
     │ ├── services/ # Business logic layer
     │ ├── types/ # TypeScript type definitions
     │ └── utils/ # Utility functions
     ├── routes/ # SvelteKit routes
     │ ├── (protected)/ # Protected routes (require authentication)
     │ └── (public)/ # Public routes

### Database

- Uses PostgreSQl with Drizzle ORM
- Schema defined in `src/lib/server/db/schema.ts`
- Migrations handled automatically with `drizzle-kit`
- create a local postgress database

## Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Database
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio for database management

# Type Checking
pnpm check        # Run type checks
pnpm lint        # Run linter
```

## Authentication

- Session-based authentication
- Cookies used for session management
- Protected routes in `(protected)` directory
