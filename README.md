# Workout App

A modern workout tracking application built with SvelteKit, TypeScript, and PostgreSQL, running in a fully containerized development environment.

## 🚀 Quick Start

```bash
# Start the development environment
docker-compose up -d

# Open http://localhost:5173
# Your app is ready!
```

## 🏗️ Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: TailwindCSS + DaisyUI
- **Database**: PostgreSQL with Drizzle ORM
- **Runtime**: Bun (containerized)
- **Development**: Hot reload, full IDE intellisense

## 📋 Development Commands

```bash
# Environment
./scripts/dev.sh start      # Start development
./scripts/dev.sh logs       # View logs
./scripts/dev.sh shell      # Container shell

# Dependencies
./scripts/dev.sh add package-name          # Add dependency
./scripts/dev.sh add -D dev-package        # Add dev dependency
./scripts/dev.sh sync                      # Sync to IDE

# Database
./scripts/dev.sh db                        # Connect to PostgreSQL
```

## 🐳 Container Setup

This project uses a containerized development environment:

- **No local Node.js required** - Everything runs in Docker
- **Full IDE support** - Dependencies sync automatically for intellisense
- **Cross-machine compatibility** - Identical environment everywhere
- **Fast dependency installs** - Bun in container vs npm on host

## 🔧 Project Structure

```
workout/
├── src/
│   ├── lib/
│   │   └── server/db/       # Database schema & config
│   └── routes/              # SvelteKit routes
├── drizzle.config.ts        # Database configuration
├── docker-compose.yml       # Development environment
└── scripts/dev.sh           # Development helper
```

## 🗄️ Database

- **PostgreSQL 17.6** running in container
- **Drizzle ORM** for type-safe database operations
- **Accessible at** localhost:5432 for database tools
- **Schema migrations** managed through Drizzle Kit

## 🚀 Production Deployment

```bash
# Use production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## 🔄 Cross-Machine Development

```bash
# On any machine with Docker + Git
git pull
docker-compose up -d
# Continue development seamlessly
```

Perfect for development across multiple work machines or environments where you can't install Node.js locally.
