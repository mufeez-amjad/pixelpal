# Pixel Pal

## Setup Project

```
yarn
yarn build
yarn electron:serve
```

## Structure

-   `electron/` - electron app

-   `src/` - web app

-   `migrations/` - database migrations

## Create migrations

Run `yarn migrate:make <migration name>` and edit the generated file under `migrations/`.
