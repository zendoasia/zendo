# Install dependencies
FROM node:22.16.0-slim AS deps

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get upgrade -y
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
COPY nginx-entrypoint.sh /app/nginx-entrypoint.sh
RUN chmod +x /app/nginx-entrypoint.sh

# Copy lockfiles and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# Build app
FROM node:22.16.0-slim AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json next.config.js ./
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--dns-result-order=ipv4first

RUN npm run build

# Final runtime image
FROM node:22.16.0-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*
RUN groupadd -g 1001 nodejs && useradd -m -u 1001 -g nodejs nextjs

# Copy necessary files for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs

EXPOSE 3000
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "start"]