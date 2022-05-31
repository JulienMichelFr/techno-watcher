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

RUN npm ci --silent
RUN npx prisma generate
RUN npx nx run api:build:production

################################################################################
FROM common as runtime

COPY --from=build /app/dist/apps/api ./

RUN npm ci --silent

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3333

CMD ["node", "./main.js"]
