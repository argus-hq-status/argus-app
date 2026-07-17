FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable yarn && COREPACK_ENABLE_STRICT=0 yarn install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV COREPACK_ENABLE_STRICT=0
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
USER nodejs
EXPOSE 3000
ENV PORT=3000
CMD ["node", ".output/server/index.mjs"]
