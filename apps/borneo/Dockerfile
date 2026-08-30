FROM node:22-bookworm-slim

WORKDIR /app

# Install dependencies from lockfile before copying source (cache-friendly).
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Full source copy, then build (deps already match package.json).
COPY . .
RUN npm run build && chmod +x scripts/start-production.sh

ENV PORT=3000

EXPOSE 3000

CMD ["scripts/start-production.sh"]
