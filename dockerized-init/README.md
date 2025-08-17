# Universal Containerized Development Environment

A complete framework-agnostic containerized development environment that works across multiple machines with only Git, Docker, and an IDE.

**Supports:** React, Vue, SvelteKit, Next.js, Express.js, Astro, or any Node.js framework

## 🚀 Quick Start

```bash
# 1. Copy this template to your project
cp -r dockerized-init/ my-new-project/
cd my-new-project/

# 2. Start the development environment
docker-compose up -d

# 3. Initialize your project (interactive framework selection)
./scripts/dev.sh init

# 4. Start coding! Your IDE will have full intellisense
```

## ✨ Framework Support

When you run `./scripts/dev.sh init`, you can choose from:

- **SvelteKit** (TypeScript)
- **React** (Vite + TypeScript)  
- **Vue** (Vite + TypeScript)
- **Next.js** (App Router + TypeScript)
- **Express.js** (TypeScript)
- **Astro** (TypeScript)
- **Custom/Manual** setup

## 🎯 Why This Setup?

### **Perfect For:**
- **Work environments** where you can't install runtimes locally
- **Team consistency** - everyone has identical development environment
- **Multi-machine development** - laptop, desktop, server, anywhere
- **Clean host systems** - no Node.js version conflicts
- **True environment parity** - dev exactly matches production

### **Key Benefits:**
- ✅ **No local runtime needed** - Node.js, Python, etc. all containerized
- ✅ **Full IDE intellisense** - Dependencies sync automatically to host
- ✅ **Cross-machine compatibility** - Just `git pull` + `docker-compose up`
- ✅ **Framework flexible** - Use any web framework or backend
- ✅ **Fast dependency installs** - Bun in container vs npm on host
- ✅ **Database included** - PostgreSQL with dev/prod configurations

## 📋 Available Commands

### **Environment Management**
```bash
./scripts/dev.sh start      # Start development environment
./scripts/dev.sh build      # Rebuild containers
./scripts/dev.sh clean      # Clean containers and volumes
./scripts/dev.sh logs       # Show container logs
./scripts/dev.sh shell      # Open shell in container
```

### **Project Initialization**
```bash
./scripts/dev.sh init       # Interactive framework selection
```

### **Package Management**
```bash
# Add regular dependencies
./scripts/dev.sh add tailwindcss
./scripts/dev.sh add drizzle-orm

# Add dev dependencies (multiple ways)
./scripts/dev.sh add -D typescript
./scripts/dev.sh add --dev @types/node
./scripts/dev.sh add prettier --dev
./scripts/dev.sh add-dev vitest

# Install all dependencies
./scripts/dev.sh install

# Sync dependencies to host (for IDE)
./scripts/dev.sh sync
```

### **Database**
```bash
./scripts/dev.sh db         # Connect to PostgreSQL
```

## 🔧 Customization

### **Remove Database**
If you don't need PostgreSQL:

1. Remove the `db` service from `docker-compose.yml`
2. Remove database-related environment variables

### **Change Runtime**
To use Node.js instead of Bun:

1. Change `FROM oven/bun:1` to `FROM node:20` in `Dockerfile`
2. Replace `bun` commands with `npm` in `scripts/dev.sh`

### **Add Services**
Need Redis, MongoDB, etc.? Add them to `docker-compose.yml`:

```yaml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
```

## 🔄 Cross-Machine Workflow

### **Machine A (Development)**
```bash
# Code, add dependencies, commit
./scripts/dev.sh add some-package
git add .
git commit -m "Add new feature"
git push
```

### **Machine B (Continue Development)**
```bash
# Pull and continue seamlessly
git pull
docker-compose up -d
# All dependencies and environment are identical
```

### **No Manual Setup Required**
- No Node.js installation
- No dependency version conflicts
- No "works on my machine" issues
- Identical environment everywhere

## 🐳 Container Details

### **Volume Strategy**
- **Source code**: Bind mounted for live editing
- **Dependencies**: Named volume for performance + sync to host for IDE
- **Database**: Persistent volume for data retention

### **Port Mapping**
- **5173**: Web development server (Vite/SvelteKit)
- **3000**: Alternative development port (Next.js/Express)
- **5432**: PostgreSQL (exposed for database tools)

### **User Permissions**
- Container runs as `bun` user (UID 1000)
- Files are owned by your host user for easy editing
- No permission conflicts between container and host

## 📁 What's Included

```
dockerized-init/
├── Dockerfile              # Container definition
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production overrides  
├── scripts/
│   └── dev.sh             # Development helper
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── .dockerignore          # Docker ignore rules
└── README.md              # This file
```

## 🚀 Production Deployment

```bash
# Use production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

# Production differences:
# - No exposed PostgreSQL port (security)
# - No source code mounting
# - Optimized build process
```

## 🤝 Contributing

This is a template/framework meant to be copied and customized. Feel free to:

1. **Fork** for your own projects
2. **Modify** for your specific needs  
3. **Share** improvements back to the community

## 🔧 Troubleshooting

### **Dependencies not showing in IDE**
```bash
./scripts/dev.sh sync
```

### **Permission issues**
```bash
docker-compose exec --user root app chown -R bun:bun /app
```

### **Port conflicts**
Edit port mappings in `docker-compose.yml`

### **Clean restart**
```bash
./scripts/dev.sh clean
./scripts/dev.sh start
```

## 📝 License

MIT License - Use this however you want!

## 🙏 Credits

Created for developers who need truly portable development environments that work anywhere with just Git + Docker + IDE.