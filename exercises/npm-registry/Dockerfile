FROM node:12.22.6-alpine3.14 AS base

WORKDIR /src

FROM base AS test

COPY package.json package-lock.json .
RUN npm ci
COPY ./ ./
RUN npm test
