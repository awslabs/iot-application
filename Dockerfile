# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 node:alpine as builder 

WORKDIR /usr/src/app-build

# Install missing dep for turbo
RUN apk add --no-cache libc6-compat

# Install global dependencies
RUN yarn add global nest turbo typescript

# Copy core dependency metadata files for install
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./apps/core/package.json ./apps/core/package.json
COPY ./packages/tsconfig/package.json ./packages/tsconfig/package.json

RUN yarn install

# Copy source code files for core build
COPY ./turbo.json ./turbo.json
COPY ./apps/core/ ./apps/core/
COPY ./packages/tsconfig/ ./packages/tsconfig/

RUN yarn build

# Prune non-production dependencies
RUN yarn install --production


FROM node:alpine as packager

WORKDIR /usr/src/app

# Copy the node_modules
COPY --from=builder /usr/src/app-build/node_modules ./node_modules
COPY --from=builder /usr/src/app-build/apps/core/node_modules ./apps/core/node_modules

# Copy the core build
COPY --from=builder /usr/src/app-build/apps/core/dist ./apps/core/dist

EXPOSE 3000

CMD ["node", "apps/core/dist/main.js"]
