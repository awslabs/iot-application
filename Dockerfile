# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /usr/src/app-build

# Configure Node memory allocation
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy package.json files
COPY ./package.json ./package.json
COPY ./apps/client/package.json ./apps/client/package.json
COPY ./apps/core/package.json ./apps/core/package.json
COPY ./cdk/package.json ./cdk/package.json
COPY ./packages/eslint-config-custom/package.json ./packages/eslint-config-custom/package.json
COPY ./packages/jest-config/package.json ./packages/jest-config/package.json
COPY ./packages/tsconfig/package.json ./packages/tsconfig/package.json

# Copy source code files
COPY ./yarn.lock ./yarn.lock
COPY ./turbo.json ./turbo.json
COPY ./apps/client ./apps/client/
COPY ./apps/core ./apps/core/
COPY ./packages/tsconfig ./packages/tsconfig/

# Install all dependencies
RUN yarn install --frozen-lockfile

# Build both client and core
RUN yarn workspace client build
RUN yarn workspace core build

# Install dependencies for core only
RUN yarn workspace core install --frozen-lockfile --production


FROM --platform=linux/amd64  node:18-alpine AS packager

WORKDIR /usr/src/app

# Copy the node_modules
COPY --from=builder /usr/src/app-build/node_modules ./node_modules/
COPY --from=builder /usr/src/app-build/apps/core/node_modules ./apps/core/node_modules/

# Copy the yarn.lock
COPY --from=builder /usr/src/app-build/yarn.lock ./yarn.lock

# Copy the client build
COPY --from=builder /usr/src/app-build/apps/client/build ./apps/client/build/

# Copy the core build
COPY --from=builder /usr/src/app-build/apps/core/dist ./apps/core/dist/

WORKDIR /usr/src/app/apps/core

EXPOSE 3000

CMD ["node", "dist/main.js"]
