# Example Configurations

This directory contains example configurations for different use cases.

## Frontend Only (No Database)

For React/Vue/SvelteKit projects that don't need a database:

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - '5173:5173'
    volumes:
      - .:/app
      - node_modules:/app/node_modules
      - ./node_modules:/host/node_modules
    environment:
      - NODE_ENV=development

volumes:
  node_modules:
```

## Full-Stack with Multiple Databases

For projects needing PostgreSQL + Redis:

```yaml
# docker-compose.yml
services:
  app:
    # ... (same as above)
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379

  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password

  redis:
    image: redis:alpine
    ports:
      - '6379:6379'
```

## Python Alternative

For Python projects using Poetry:

```dockerfile
# Dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y git
WORKDIR /app

# Create sync script for Python packages
RUN echo '#!/bin/bash\ncp -r /app/.venv/* /host/.venv/ 2>/dev/null || true' > /sync-deps.sh
RUN chmod +x /sync-deps.sh

USER python
RUN pip install poetry

CMD ["poetry", "run", "python", "main.py"]
```

## Microservices

For multiple services in one environment:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
  
  api:
    build: ./api
    ports:
      - '8000:8000'
  
  worker:
    build: ./worker
```

These are just examples - customize for your specific needs!