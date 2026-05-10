FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
    ghostscript \
    qpdf \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

EXPOSE 3000

# Start production server
CMD ["npm", "start"]
