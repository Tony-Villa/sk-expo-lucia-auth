# SvelteKit + Expo + Turso + Lucia  | Multi App Auth
Implementation of Lucia auth with SvelteKit and React Native (Expo) using Turso as a database and drizzle ORM.


### Setup
## SvelteKit 
I use `pnpm` but use any package manager you use

```zsh
cd web

pnpm i
pnpm run db:generate
pnpm run db:up
pnpm run db:push
```

## Turso
Within the web directory authenticate into Turso
```
turso auth
```

Serve a sqlite db locally
```
turso dev --db-file local.db
```
If you don't want to use turso, you'll have to change the config to use a local sqlite db.


## Mobile
Due to some issues with `pnpm` and expo prebuild, I decided to use `npm` here.
```zsh
cd mobile
npm i
npx expo prebuild
npx expo run:ios
```
I've only tested this on the iPhone simulator, but in theory it should work on android too. If you're want to test this on android run `npx expo run:android` instead or `ios`