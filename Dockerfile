FROM node:22-alpine AS base
WORKDIR /app

# Enable corepack (for Yarn)
RUN corepack enable

# Install build tools for native deps (remove if you don’t need them)
RUN apk add --no-cache python3 make g++

# Copy only dependency files first (cache layer)
COPY package.json yarn.lock ./

# Install all dependencies (use BuildKit cache mounts)
RUN --mount=type=cache,target=/root/.yarn \
    --mount=type=cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile

# Copy app source
COPY . .

# Build app
RUN yarn build

# ---- Production image ----
FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable

# Copy only runtime dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY package.json yarn.lock ./

EXPOSE 3000
CMD ["yarn", "start:prod"]
