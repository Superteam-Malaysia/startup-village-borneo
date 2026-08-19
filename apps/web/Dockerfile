FROM node:22-bookworm-slim

WORKDIR /app

# Install dependencies from lockfile before copying source (cache-friendly).
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Full source copy, then build (deps already match package.json).
COPY . .
RUN npm run build

ENV PORT=3000

EXPOSE 3000

# Run migrations/seeds before Next.js; keep NODE_ENV unset so npm scripts behave like Nixpacks.
CMD ["sh", "-c", "npm run db:migrate && npm run db:import-guests && npm run db:seed-teams && npm run db:seed-staff && NODE_ENV=production npm run start"]
