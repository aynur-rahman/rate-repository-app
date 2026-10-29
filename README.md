# Rate Repository

Full Stack Open Part 10 application built with Expo SDK 55, React Native, Expo Router and Apollo Client.

Lists repositories from the GraphQL API, with a scrollable app bar and a validated sign-in form built with Formik and Yup. Signing in stores the access token with AsyncStorage, and the app bar switches between Sign in and Sign out. Text uses Roboto on Android and Arial on iOS.

## Local setup

Use Node 24 and install dependencies with `npm ci`. Copy `.env.example` to `.env`, then configure `EXPO_PUBLIC_APOLLO_URI` for the separately running [course API](https://github.com/fullstack-hy2020/rate-repository-api).

The API requires Node 22. Follow its setup instructions. For a physical phone, use the development computer's reachable LAN address instead of `localhost`; Android emulator host access normally uses `10.0.2.2`.

Run `npm start` and open the project with Expo Go or an emulator. `npm run web` provides a browser preview.

## Checks

- `npm run lint`
- `npm run typecheck`
