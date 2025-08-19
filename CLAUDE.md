# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Local Development (Containerized)**
- `./scripts/dev.sh start` - Start development environment with hot reload
- `./scripts/dev.sh shell` - Open shell in app container for running commands
- `./scripts/dev.sh db` - Connect to PostgreSQL database directly

**Package Management**
- `./scripts/dev.sh add <package>` - Add npm package
- `./scripts/dev.sh add -D <package>` - Add dev dependency
- `./scripts/dev.sh install` - Install all dependencies
- `./scripts/dev.sh sync` - Sync container dependencies to host for IDE

**Build & Quality**
- `npm run build` - Build production bundle
- `npm run check` - Run TypeScript and Svelte checks
- `npm run format` - Format code with Prettier
- `npm run lint` - Check code formatting

**Database Operations**
- `npx drizzle-kit generate` - Generate database migrations
- `npx drizzle-kit migrate` - Run database migrations
- `npx drizzle-kit studio` - Open Drizzle Studio database UI

## Architecture Overview

### Technology Stack
- **Framework**: SvelteKit with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with refresh token rotation
- **Styling**: TailwindCSS with DaisyUI components
- **Container**: Docker with development environment automation

### Database Architecture

Three-layer architecture following strict separation of concerns:

**Schema Layer** (`src/lib/server/db/schema/`)
- Drizzle table definitions and Zod validation schemas
- Database structure and TypeScript types
- File naming: `*.schema.ts` (e.g., `auth.schema.ts`)

**Query Layer** (`src/lib/server/db/queries/`)
- Pure database operations (CRUD)
- No business logic - only data access
- File naming: plural nouns (e.g., `users.ts`, `sessions.ts`)

**Service Layer** (`src/lib/server/db/services/`)
- Business logic and complex workflows
- Orchestrates multiple queries and handles transactions
- File naming: singular nouns (e.g., `auth.ts`, `user.ts`)

### Authentication System

JWT-based authentication with automatic token refresh:
- Access tokens (15min) for API authorization
- Refresh tokens (30 days) for seamless renewal
- Server hook (`hooks.server.ts`) handles token validation/refresh
- Protected routes use `+layout.server.ts` for authentication gates

### Route Protection

Protected routes are in `/app/*` directory:
- `src/routes/app/+layout.server.ts` - Authentication gate
- Redirects unauthenticated users to login
- Passes user data to child routes

### Database Connection

Environment variable `POSTGRES_URL` required for database connection.
Development uses PostgreSQL container with credentials:
- Database: `workout`
- User: `postgres`
- Password: `password`
- Port: `5432`

### Development Environment

Fully containerized development with host IDE support:
- All runtimes in Docker containers
- Dependencies synced to host for IDE intellisense
- Hot reload and live editing supported
- No local Node.js installation required

## Important Patterns

### File Organization Rules
1. One concern per file with clear responsibility
2. Follow layer isolation (queries don't call services)
3. Use explicit imports with proper namespacing
4. Maintain consistent naming conventions per layer

### Database Naming Conventions
- Tables: `snake_case` plural (e.g., `users`, `website_roles`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`)
- Schema exports: `camelCase` (e.g., `usersTable`, `sessionSelectSchema`)

### Authentication Flow
1. User submits credentials
2. Service layer validates and creates session
3. Access/refresh tokens set as httpOnly cookies
4. Server hook validates tokens on each request
5. Automatic refresh when access token expires