# Rate Repository

Full Stack Open Part 10 application built with Expo SDK 55, React Native, Expo Router and Apollo Client.

Browse and filter repositories, sort ratings, register and sign in, create reviews, and manage your reviews. Repository and review lists support cursor pagination.

## Try the app

Scan the QR code with the [Expo Go](https://expo.dev/go) app to open the published version. It uses the course's hosted Rate Repository API, whose database is reset regularly.

![QR code for the published app](qr-code.png)

Published with EAS Update (branch `main`, runtime version 1.0.0). Link: `exp://u.expo.dev/f6e19967-ad0f-4fac-9631-74609a2a1044/group/3f1231ae-71ee-4f84-a1e5-9de651028534`

## Local setup

Use Node 24 and install dependencies with `npm ci`. Copy `.env.example` to `.env`, then configure `EXPO_PUBLIC_APOLLO_URI` for the separately running [course API](https://github.com/fullstack-hy2020/rate-repository-api).

The API requires Node 22. Follow its setup instructions. For a physical phone, use the development computer's reachable LAN address instead of `localhost`; Android emulator host access normally uses `10.0.2.2`.

Run `npm start` and open the project with a compatible Expo Go installation or simulator. `npm run web` provides a browser preview; native confirmation behavior must also be checked on a device or simulator.

## Checks

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npx expo-doctor`
- `npm run export` to bundle web, iOS and Android
- `npm run test:e2e` with the local API on port4000 and web app on port8081

The browser tests create synthetic accounts and reviews in the local API database. Use a disposable local database. The required repository-list test uses the course's original fixture.
