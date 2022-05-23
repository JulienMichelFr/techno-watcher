################################################################################
FROM node:16.14.2-alpine as base

WORKDIR /app

################################################################################
FROM base as common

RUN apk update && apk add python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json .
COPY package-lock.json .

################################################################################
FROM common as build

RUN apk add git

# Files
COPY tsconfig.base.json .
COPY nx.json .
COPY decorate-angular-cli.js .
COPY angular.json .
COPY migrations.json .

# Folders
COPY .git .git
COPY prisma prisma
COPY apps apps
COPY libs libs

RUN npm install
RUN npx prisma generate
RUN npx nx build api

################################################################################
FROM common as runtime

COPY --from=2 dist ./dist
COPY --from=2 node_modules ./node_modules

RUN npm prune --production

COPY --from=2 node_modules/.prisma ./node_modules/.prisma
COPY --from=2 node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000

CMD ["node", "./dist/apps/api/main.js"]
