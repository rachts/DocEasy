FROM node:22-bookworm-slim

# Install system dependencies for document processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    qpdf \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy package files for deterministic install
COPY package.json package-lock.json ./

# Install exact dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build Next.js application
RUN npm run build

# Create non-root system user and group for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
