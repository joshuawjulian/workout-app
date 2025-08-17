# Universal Containerized Development Environment
# Supports any Node.js framework: React, Vue, SvelteKit, Next.js, Express, etc.

FROM oven/bun:1 as development

# Install git (needed for some packages) and other tools
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create a script to sync node_modules to host for IDE intellisense (as root)
RUN echo '#!/bin/bash\nif [ -d "/app/node_modules" ] && [ -d "/host/node_modules" ]; then cp -r /app/node_modules/* /host/node_modules/ 2>/dev/null || true; fi' > /sync-deps.sh && chmod +x /sync-deps.sh

# Change ownership of app directory to bun user
RUN chown -R bun:bun /app

# Switch to bun user for development
USER bun

# Wait for package.json to exist, then start dev server
CMD ["/bin/bash", "-c", "while [ ! -f package.json ]; do echo 'Waiting for project to be initialized...'; sleep 2; done; if [ -f package.json ]; then /sync-deps.sh && bun run dev --host 0.0.0.0; else echo 'No package.json found. Run: ./scripts/dev.sh init'; while true; do sleep 30; done; fi"]