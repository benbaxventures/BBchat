# BBchat

BBchat is an original mobile messaging MVP for iOS and Android, built with Expo and React Native.

## Run locally

Install dependencies with `npm install`, then start Expo with `npm start`. Open the project in Expo Go or use `npm run ios` / `npm run android` with the corresponding development environment installed.

## Build installable mobile apps

BBchat targets native iOS and Android using Expo. To create installable cloud builds, sign in to an Expo account with `npx eas-cli login`, then run:

- `npm run build:android` to create an Android APK for direct testing and installation.
- `npm run build:ios` to create an iOS internal-testing build. Apple signing credentials and registered test devices are required.
- `npm run build:all` to build both platforms.

For an iOS simulator build, use `npx eas-cli build --platform ios --profile development`. Store releases use the `production` profile; publishing to the App Store or Google Play additionally requires the corresponding developer accounts and store setup. Builds run through EAS and require an Expo account; no signed app binaries are included in this repository.

## What's included

- Search conversations and message text; filter unread, group, and archived chats.
- Create group conversations, and pin, archive, mute, mark unread, or delete chats.
- Reply to messages, add emoji reactions, star messages, and delete your own messages.
- Pick or take photos, and record and play back voice notes on supported devices.
- Import phone contacts with permission, share files, copy/share messages, and send a one-time current-location map link.
- Share text or photo status updates and browse sample updates.
- Request device notification permission and send a local notification test.
- The Benbax logo and Benbax's green, cyan, and amber brand palette.
- Choose, crop, change, and remove a profile picture; the selected image is saved locally on this device.
- A Meta AI shortcut that opens Meta AI externally; BBchat does not send chat content to it.
- Local chat and status persistence on the current device.
- A dashboard that records and lists conversation openings locally on the current device.
- A device-local password gate for the dashboard; native builds use secure storage.

## Current limitations

This is a local-first prototype; messages, statuses, and dashboard connection records are not delivered to other users or synchronized across devices. A connection record is created when a conversation is opened and is stored only on that device. The dashboard password is a local app lock, not server authentication; on web, it is stored in browser storage and does not protect against someone with browser access. The dashboard's Bitcoin total stays at zero: opening a chat is not a Bitcoin payment, and no wallet, payment collection, or blockchain verification is configured. Real multi-user connection reporting and verified Bitcoin payments require a secure backend and a payment-verification integration. Device contacts are only read after the user grants permission. Location is only accessed after the user selects “Share current location,” and BBchat sends a one-time map link rather than tracking location in the background. Local notification permissions and test notifications work on native builds; remote push delivery still requires EAS credentials, a push token registry, and a server. A backend is also required for accounts, real-time messaging, read receipts, online presence, group invitations, end-to-end encryption, cloud media storage, and live voice/video calls. Camera and microphone access require device permission; web browsers also require a secure context for media features. Local media references may not survive clearing app data or restarting a browser session.
