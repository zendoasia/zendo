# --- Dependencies Layer ---
FROM node:22.16.0-slim AS deps
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install --frozen-lockfile

# --- Builder Layer ---
FROM node:22.16.0-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Runtime Layer ---
FROM node:22.16.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN groupadd -g 1001 nodejs && useradd -m -u 1001 -g nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]