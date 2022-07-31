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

### [Webapp](https://github.com/JulienMichelFr/techno-watcher/tree/main/apps/techno-watcher)

- [Angular](https://angular.io) as framework
- [Ngrx](https://ngrx.io/) as state management
- [Storybook](https://storybook.js.org/) as component catalog

### Tooling

- [Jest](https://jestjs.io/fr/) as test runner
- [ESLint](https://eslint.org/) as linter
- [Prettier](https://prettier.io/) as code formatter
