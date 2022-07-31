# TechnoWatcher

This project is a simple [Hackernews](https://news.ycombinator.com/) clone where users can share a link and then posts comments.

## Stack

The project is using [Nx](https://nx.dev/) for the monorepo management.

### [API](https://github.com/JulienMichelFr/techno-watcher/tree/main/apps/api)

- [NestJS](https://nestjs.com/) as framework
- [Prisma](https://www.prisma.io/) as ORM
- [PostgreSQL](https://www.postgresql.org/) as database
- [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) as validator and
  serializer/de-serializer
- [dotenv](https://www.npmjs.com/package/dotenv) as configuration reader

### [Webapp](https://github.com/JulienMichelFr/techno-watcher/tree/main/apps/techno-watcher)

- [Angular](https://angular.io) as framework
- [Ngrx](https://ngrx.io/) as state management
- [Storybook](https://storybook.js.org/) as component catalog

### Tooling

- [Jest](https://jestjs.io/fr/) as test runner
- [ESLint](https://eslint.org/) as linter
- [Prettier](https://prettier.io/) as code formatter

## Requirements

- NodeJS 16
- A PostgreSQL

## Development quickstart

- Clone this repository: `git clone https://github.com/JulienMichelFr/techno-watcher`
- Install dependencies: `npm install`
- Create a valid .env file using [.env.sample](https://github.com/JulienMichelFr/techno-watcher/blob/main/.env.sample) as a template
- Sync the database with prisma: `prisma db push`
- (Optional) seed the database: `prisma db seed`
- Start the API: `nx run api:serve` (started on `http://localhost:3333` by default)
- Start the Webapp: `nx run techno-watcher:serve` (started on `http://localhost:4200` by default)
