#!/bin/bash
# Universal Containerized Development Environment Helper
# 
# This script provides convenient commands for managing a Docker-based development
# environment where runtimes are containerized but the IDE runs on the host.
# 
# Key features:
# - All dependencies are installed in the container for performance
# - Dependencies are synced to host for IDE intellisense
# - No local runtime installation required (Node.js, Python, etc.)
# - Works across multiple machines with just Git + Docker
# - Framework agnostic - supports any web framework or backend

set -e

case "$1" in
  "start")
    # Start the development environment with hot reload
    echo "🚀 Starting development environment..."
    docker-compose up
    ;;
  "build")
    # Rebuild Docker containers from scratch
    echo "🏗️ Building containers..."
    docker-compose build
    ;;
  "clean")
    # Remove all containers, volumes, and unused Docker resources
    echo "🧹 Cleaning up containers and volumes..."
    docker-compose down -v
    docker system prune -f
    ;;
  "logs")
    # Show and follow logs from all containers
    echo "📋 Showing logs..."
    docker-compose logs -f
    ;;
  "shell")
    # Open an interactive bash shell inside the app container
    echo "🐚 Opening shell in app container..."
    docker-compose exec app /bin/bash
    ;;
  "db")
    # Connect directly to PostgreSQL database
    echo "🗄️ Connecting to database..."
    docker-compose exec db psql -U postgres -d myapp
    ;;
  "init")
    # Initialize a new project based on framework choice
    echo "🚀 Initialize New Project"
    echo ""
    echo "Choose a framework:"
    echo "1) SvelteKit (TypeScript)"
    echo "2) React (Vite + TypeScript)"
    echo "3) Vue (Vite + TypeScript)"
    echo "4) Next.js"
    echo "5) Express.js"
    echo "6) Astro"
    echo "7) Custom/Manual"
    echo ""
    read -p "Enter choice (1-7): " choice
    
    case $choice in
      1)
        echo "📦 Creating SvelteKit project..."
        docker-compose exec app bun create svelte@latest . --template typescript
        ;;
      2)
        echo "📦 Creating React project..."
        docker-compose exec app bun create vite@latest . --template react-ts
        ;;
      3)
        echo "📦 Creating Vue project..."
        docker-compose exec app bun create vite@latest . --template vue-ts
        ;;
      4)
        echo "📦 Creating Next.js project..."
        docker-compose exec app bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
        ;;
      5)
        echo "📦 Creating Express.js project..."
        docker-compose exec app bash -c "bun init -y && bun add express && bun add -D @types/express typescript"
        docker-compose exec app bash -c "echo 'import express from \"express\"; const app = express(); app.get(\"/\", (req, res) => res.send(\"Hello World!\")); app.listen(3000, () => console.log(\"Server running on port 3000\"));' > index.ts"
        ;;
      6)
        echo "📦 Creating Astro project..."
        docker-compose exec app bun create astro@latest . --template minimal --typescript strict
        ;;
      7)
        echo "📦 Creating minimal package.json..."
        docker-compose exec app bun init -y
        echo "✅ Ready for custom setup!"
        ;;
      *)
        echo "❌ Invalid choice"
        exit 1
        ;;
    esac
    
    echo "📦 Syncing dependencies to host..."
    docker-compose exec app /sync-deps.sh
    echo "✅ Project initialized! You can now start coding."
    ;;
  "add")
    # Add a package dependency with optional dev flag
    # Supports: add package, add -D package, add --dev package, add package --dev, add package -D
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/dev.sh add [-D|--dev] <package-name> [--dev|-D]"
      exit 1
    fi
    
    # Parse arguments to detect dev flag in any position
    dev_flag=false
    package_name=""
    
    for arg in "$@"; do
      case "$arg" in
        "add") continue ;;
        "-D"|"--dev") dev_flag=true ;;
        *) 
          if [ -z "$package_name" ]; then
            package_name="$arg"
          fi
          ;;
      esac
    done
    
    if [ "$dev_flag" = true ]; then
      echo "📦 Adding dev dependency: $package_name"
      docker-compose exec app bun add -D "$package_name"
    else
      echo "📦 Adding package: $package_name"
      docker-compose exec app bun add "$package_name"
    fi
    
    # Sync dependencies to host for IDE intellisense
    echo "🔄 Syncing dependencies to host for IDE..."
    docker-compose exec app /sync-deps.sh
    ;;
  "add-dev")
    # Add a dev dependency (shorthand for add --dev)
    if [ -z "$2" ]; then
      echo "Usage: ./scripts/dev.sh add-dev <package-name>"
      exit 1
    fi
    echo "📦 Adding dev dependency: $2"
    docker-compose exec app bun add -D "$2"
    
    # Sync dependencies to host for IDE intellisense
    echo "🔄 Syncing dependencies to host for IDE..."
    docker-compose exec app /sync-deps.sh
    ;;
  "install")
    # Install all dependencies from package.json
    echo "📦 Installing dependencies..."
    docker-compose exec app bun install
    
    # Sync dependencies to host for IDE intellisense
    echo "🔄 Syncing dependencies to host for IDE..."
    docker-compose exec app /sync-deps.sh
    ;;
  "sync")
    # Manually sync dependencies from container to host
    # Useful if dependencies get out of sync or after manual installs
    echo "🔄 Syncing dependencies to host..."
    docker-compose exec app /sync-deps.sh
    ;;
  *)
    echo "🔧 Universal Containerized Development Helper"
    echo ""
    echo "Usage: ./scripts/dev.sh <command>"
    echo ""
    echo "Commands:"
    echo "  start    - Start development environment"
    echo "  build    - Build containers"
    echo "  clean    - Clean containers and volumes"
    echo "  logs     - Show container logs"
    echo "  shell    - Open shell in app container"
    echo "  db       - Connect to database"
    echo "  init     - Initialize project (interactive framework selection)"
    echo "  add      - Add npm package (use --dev for dev dependency)"
    echo "  add-dev  - Add dev dependency"
    echo "  install  - Install dependencies"
    echo "  sync     - Sync dependencies to host"
    echo ""
    echo "Package Management Examples:"
    echo "  ./scripts/dev.sh add tailwindcss           # Add regular dependency"
    echo "  ./scripts/dev.sh add -D typescript         # Add dev dependency"
    echo "  ./scripts/dev.sh add --dev @types/node     # Add dev dependency"
    echo "  ./scripts/dev.sh add prettier --dev        # Add dev dependency"
    echo "  ./scripts/dev.sh add eslint -D             # Add dev dependency"
    echo "  ./scripts/dev.sh add-dev vitest            # Add dev dependency (shorthand)"
    echo ""
    echo "Development Examples:"
    echo "  ./scripts/dev.sh start                     # Start development environment"
    echo "  ./scripts/dev.sh init                      # Initialize new project"
    echo "  ./scripts/dev.sh shell                     # Open shell in container"
    echo "  ./scripts/dev.sh sync                      # Sync dependencies to host"
    ;;
esac