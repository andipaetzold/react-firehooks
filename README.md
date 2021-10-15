[![npm](https://img.shields.io/npm/v/react-firehooks)](https://www.npmjs.com/package/react-firehooks)
[![tests](https://github.com/andipaetzold/react-firehooks/actions/workflows/push.yml/badge.svg?branch=main)](https://github.com/andipaetzold/react-firehooks/actions/workflows/push.yml?query=branch%3Amain)
[![downloads](https://img.shields.io/npm/dm/react-firehooks)](https://www.npmjs.com/package/react-firehooks)
[![license](https://img.shields.io/github/license/andipaetzold/react-firehooks)](https://github.com/andipaetzold/react-firehooks/blob/main/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# React Firehooks

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

-   [firebase](https://www.npmjs.com/package/firebase): 9.0.0 or greater
-   [react](https://www.npmjs.com/package/react): 16.8.0 or greater

## Usage

[Type Documentation](https://andipaetzold.github.io/react-firehooks)

This library consists of 4 modules with many hooks:

-   [`auth`](#Auth)
    -   [`useAuthState`](#useAuthState)
-   [`database`](#Database)
    -   [`useObject`](#useObject)
    -   [`useObjectOnce`](#useObjectOnce)
    -   [`useObjectValue`](#useObjectValue)
    -   [`useObjectValueOnce`](#useObjectValueOnce)
-   [`firestore`](#Firestore)
    -   [`useCollection`](#useCollection)
    -   [`useCollectionData`](#useCollectionData)
    -   [`useCollectionDataOnce`](#useCollectionDataOnce)
    -   [`useCollectionOnce`](#useCollectionOnce)
    -   [`useDocument`](#useDocument)
    -   [`useDocumentData`](#useDocumentData)
    -   [`useDocumentDataOnce`](#useDocumentataOnce)
    -   [`useDocumentOnce`](#useDocumentOnce)
-   [`storage`](#Storage)
    -   [`useDownloadURL`](#useDownloadURL)

All hooks can be imported from `react-firehooks` directly or via `react-firehooks/<module>` to improve tree-shaking and bundle size.

### Auth

```javascript
import { ... } from 'react-firehooks/auth';
```

#### useAuthState

```javascript
const [user, loading, error] = useAuthState(auth);
```

### Database

```javascript
import { ... } from 'react-firehooks/database';
```

#### useObject

```javascript
const [dataSnap, loading, error] = useObject(query);
```

#### useObjectOnce

```javascript
const [dataSnap, loading, error] = useObjectOnce(query);
```

#### useObjectValue

```javascript
const [objectValue, loading, error] = useObjectValue(query);
```

#### useObjectValueOnce

```javascript
const [objectValue, loading, error] = useObjectValueOnce(query);
```

### Firestore

```javascript
import { ... } from 'react-firehooks/firestore';
```

#### useCollection

```javascript
const [querySnap, loading, error] = useCollection(query, options);
```

#### useCollectionData

```javascript
const [data, loading, error] = useCollectionData(query, options);
```

#### useCollectionDataOnce

```javascript
const [data, loading, error] = useCollectionDataOnce(query, options);
```

#### useCollectionOnce

```javascript
const [querySnap, loading, error] = useCollectionOnce(query, options);
```

#### useDocument

```javascript
const [documentSnap, loading, error] = useDocument(documentReference, options);
```

#### useDocumentData

```javascript
const [data, loading, error] = useDocumentData(documentReference, options);
```

#### useDocumentDataOnce

```javascript
const [documentSnap, loading, error] = useDocumentDataOnce(documentReference, options);
```

#### useDocumentOnce

```javascript
const [querySnap, loading, error] = useDocumentData(documentReference, options);
```

### Storage

```javascript
import { ... } from 'react-firehooks/storage';
```

#### useDownloadURL

```javascript
const [url, loading, error] = useDownloadURL(storageReference);
```

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

This library is heavily inspired by [`react-firebase-hooks`](https://www.npmjs.com/package/react-firebase-hooks). Unfortunately, it didn't receive any updates anymore and didn't support Firebase 9. `react-firehooks` is not a fork but a completely new code base exporting almost identical hooks.

## License

[MIT](LICENSE)
