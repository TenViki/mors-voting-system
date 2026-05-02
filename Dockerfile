FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

# install deps using yarn lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# copy rest and build
COPY . .
# ensure optional static assets directory exists even if absent in git context
RUN mkdir -p public
RUN yarn prisma generate --schema=prisma/schema.prisma
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# netcat for start script DB wait
RUN apk add --no-cache netcat-openbsd

# copy built app and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 6999

CMD ["./start.sh"]
