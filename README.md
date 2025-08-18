# Project Structure & Naming Conventions

## Folder Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema/           # Database table definitions
│   │   │   │   └── *.schema.ts   # Table schemas (plural: auth.schema.ts)
│   │   │   ├── queries/          # Pure database operations
│   │   │   │   ├── users.ts      # User CRUD operations
│   │   │   │   ├── sessions.ts   # Session CRUD operations
│   │   │   │   └── roles.ts      # Role CRUD operations
│   │   │   ├── services/         # Business logic layer
│   │   │   │   ├── auth.ts       # Authentication business logic
│   │   │   │   └── users.ts      # User management logic
│   │   │   └── conn.ts           # Database connection setup
│   │   └── auth.ts               # Auth utilities (hashing, JWT, etc.)
│   └── index.ts                  # Library exports
├── routes/
│   ├── +page.svelte             # Pages use kebab-case with + prefix
│   ├── +page.server.ts          # Server-side page logic
│   └── api/
│       └── test/
│           └── +server.ts       # API endpoints
└── app.html                     # App template
```

## Naming Conventions

### File Naming

- **Database schemas**: `*.schema.ts` (e.g., `auth.schema.ts`, `workout.schema.ts`)
- **Query files**: `plural.ts` (e.g., `users.ts`, `sessions.ts`, `roles.ts`)
- **Service files**: `singular.ts` (e.g., `auth.ts`, `user.ts`)
- **SvelteKit routes**: `+page.svelte`, `+page.server.ts`, `+server.ts`
- **Regular TypeScript**: `kebab-case.ts` or `camelCase.ts`

### Folder Naming

- **Database folders**: `snake_case` or `camelCase` (e.g., `schema/`, `queries/`, `services/`)
- **Route folders**: `kebab-case` (e.g., `api/`, `auth/`, `user-profile/`)

### Variable & Function Naming

- **Functions**: `camelCase` (e.g., `getUserById`, `validateLogin`)
- **Variables**: `camelCase` (e.g., `userId`, `refreshToken`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DATABASE_URL`, `JWT_SECRET`)
- **Types**: `PascalCase` ending with `Type` (e.g., `UserSelectType`, `SessionSelectType`)
- **Schemas**: `camelCase` ending with `Schema` (e.g., `userSelectSchema`, `sessionSchema`)

### Database Conventions

- **Table names**: `snake_case` plural (e.g., `users`, `sessions`, `website_roles`)
- **Column names**: `snake_case` (e.g., `user_id`, `refresh_token`, `created_at`)
- **Schema exports**: `camelCase` (e.g., `users`, `sessions`, `websiteRoles`)

## Layer Responsibilities

### Schema Layer (`schema/`)

- Define database table structure
- Export Drizzle table definitions
- Export Zod schemas for validation
- Export TypeScript types

### Query Layer (`queries/`)

- Pure database operations (SELECT, INSERT, UPDATE, DELETE)
- No business logic
- Return raw database results
- Handle single-table operations

### Service Layer (`services/`)

- Business logic and workflows
- Orchestrate multiple queries
- Handle transactions
- Validate business rules
- Transform data for application use

### Utilities (`lib/`)

- Helper functions
- Authentication utilities
- Shared constants
- Cross-cutting concerns

## Import Patterns

```typescript
// Schema imports
import { users, sessions } from '../schema/auth.schema';

// Query imports
import * as userQueries from '../queries/users';
import * as sessionQueries from '../queries/sessions';

// Service imports
import * as authService from '../services/auth';

// Drizzle imports
import { db } from '../conn';
import { eq, and, or } from 'drizzle-orm';
```

## File Organization Rules

1. **One concern per file** - Each file should have a single, clear responsibility
2. **Consistent naming** - Follow the conventions above consistently
3. **Layer isolation** - Queries don't call services, services don't directly access schemas
4. **Explicit imports** - Use named imports and namespace imports for clarity
5. **Type safety** - Every function should have proper TypeScript types
