# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 node:alpine as builder

WORKDIR /usr/src/app-build

# Install missing dep for turbo
RUN apk add --no-cache libc6-compat

# Install global dependencies
RUN yarn add global nest turbo typescript

# Copy source code files
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./turbo.json ./turbo.json
COPY ./apps/client ./apps/client/
COPY ./apps/core ./apps/core/
COPY ./packages/tsconfig ./packages/tsconfig/

# Install all dependencies
RUN yarn install

# Build both client and core
RUN yarn build

FROM --platform=linux/amd64 node:alpine as core-modules-installer

WORKDIR /usr/src/core-modules

# Copy core dependency metadata files for production install
# This is done to isolate the core production node_modules
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./apps/core/package.json ./apps/core/package.json

# # Install dependencies for core only
RUN yarn install --production

FROM --platform=linux/amd64  node:alpine as packager

WORKDIR /usr/src/app

# Copy the node_modules
COPY --from=core-modules-installer /usr/src/core-modules/node_modules ./node_modules/
COPY --from=core-modules-installer /usr/src/core-modules/apps/core/node_modules ./apps/core/node_modules/

# Copy the client build
COPY --from=builder /usr/src/app-build/apps/client/build ./apps/client/build/

# Copy the core build
COPY --from=builder /usr/src/app-build/apps/core/dist ./apps/core/dist/

WORKDIR /usr/src/app/apps/core

EXPOSE 3000

CMD ["node", "dist/main.js"]
