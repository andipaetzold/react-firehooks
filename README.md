[![npm](https://img.shields.io/npm/v/react-firehooks)](https://www.npmjs.com/package/react-firehooks)
[![downloads](https://img.shields.io/npm/dm/react-firehooks)](https://www.npmjs.com/package/react-firehooks)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-firehooks)](https://bundlephobia.com/package/react-firehooks)
[![tests](https://github.com/andipaetzold/react-firehooks/actions/workflows/push.yml/badge.svg?branch=main)](https://github.com/andipaetzold/react-firehooks/actions/workflows/push.yml?query=branch%3Amain)
[![license](https://img.shields.io/github/license/andipaetzold/react-firehooks)](https://github.com/andipaetzold/react-firehooks/blob/main/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# React Firehooks 🔥🪝

Lightweight dependency-free collection of React hooks for Firebase.

## Installation

```sh
npm install react-firehooks
```

or

```sh
yarn add react-firehooks
```

## Compatibility

-   [firebase](https://www.npmjs.com/package/firebase): 9.11.0 or later
-   [react](https://www.npmjs.com/package/react): 16.8.0 or later

## Usage

[Type Documentation](https://andipaetzold.github.io/react-firehooks)

This library consists of 6 modules with many hooks:

-   [`app-check`](docs/app-check.md)
-   [`auth`](docs/auth.md)
-   [`database`](docs/database.md)
-   [`firestore`](docs/firestore.md)
-   [`messaging`](docs/message.md)
-   [`storage`](docs/storage.md)

All hooks can be imported from `react-firehooks` directly or via `react-firehooks/<module>` to improve tree-shaking and bundle size.

## Development

### Build

To build the library, first install the dependencies, then run `npm run build`.

```sh
npm install
npm run build
```

### Tests

To run the tests, first install the dependencies, then run `npm test`. Watch mode can be started with `npm test -- --watch`.

```sh
npm install
npm test
```

## Resources

### React Firebase Hooks

This library is heavily inspired by [`react-firebase-hooks`](https://www.npmjs.com/package/react-firebase-hooks). It was created because `react-firebase-hooks` seemed unmaintained and did not support Firebase v9 for a couple of months. `react-firehooks` is not a fork but a completely new code base exporting almost identical hooks.

## License

[MIT](LICENSE)
