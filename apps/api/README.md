# API

The REST API for the [techno-watcher project](https://github.com/JulienMichelFr/techno-watcher)

## Stack

- [NestJS](https://nestjs.com/) as framework
- [Prisma](https://www.prisma.io/) as ORM
- [PostgreSQL](https://www.postgresql.org/) as database
- [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) as validator and
  serializer/de-serializer
- [dotenv](https://www.npmjs.com/package/dotenv) as configuration reader

## Database Models

| Model                                                                                             | Description                                         |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [User](https://github.com/JulienMichelFr/techno-watcher/blob/main/prisma/schema.prisma#L12)       | A basic user representation                         |
| [Invitation](https://github.com/JulienMichelFr/techno-watcher/blob/main/prisma/schema.prisma#L56) | A list of invitation required for user registration |
| [Post](https://github.com/JulienMichelFr/techno-watcher/blob/main/prisma/schema.prisma#L27)       | A basic post representation                         |
| [Comment](https://github.com/JulienMichelFr/techno-watcher/blob/main/prisma/schema.prisma#L41)    | A basic comment representation                      |

## Useful commands

- Build: `nx run api:build`
- Run as dev: `nx run api:serve`
- Run unit tests: `nx run api:test`
- Run E2E tests: `nx run api:e2e`
- Sync DB with Prisma: `prisma db push`
- Seed database using [seed function](https://github.com/JulienMichelFr/techno-watcher/blob/main/prisma/seed.ts): `prisma db seed`
- Open [Prisma studio](https://www.prisma.io/studio): `prisma studio`

## Requirements

- NodeJS 16
- A PostgreSQL DB
