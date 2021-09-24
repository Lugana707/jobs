FROM node:12.22.6-alpine3.14 AS base

WORKDIR /src

FROM base AS test

COPY package.json package-lock.json .
RUN npm ci
COPY ./ ./
RUN npm run lint
RUN npm test

FROM base

COPY ./ ./
COPY --from=test /src/node_modules ./node_modules
ENV NODE_ENV=production

CMD ["npm", "start"]
