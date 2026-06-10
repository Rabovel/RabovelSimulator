FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/db/package.json ./packages/db/
COPY apps/api/package.json ./apps/api/
RUN npm ci
COPY packages/db ./packages/db
COPY apps/api ./apps/api
RUN npm run generate -w @rabovel/db
RUN npm run build -w @rabovel/db
RUN npm run build -w @rabovel/api

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
