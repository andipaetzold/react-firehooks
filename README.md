[![npm](https://img.shields.io/npm/v/react-firehooks)](https://www.npmjs.com/package/react-firehooks)
[![tests](https://github.com/andipaetzold/react-firehooks/actions/workflows/push.yml/badge.svg?branch=main)](https://github.com/andipaetzold/react-firehooks/actions/workflows/push.yml?query=branch%3Amain)
[![downloads](https://img.shields.io/npm/dm/react-firehooks)](https://www.npmjs.com/package/react-firehooks)
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

Returns and updates the currently authenticated user

```javascript
const [user, loading, error] = useAuthState(auth);
```

Params:

-   `auth`: Firebase Auth instance

Params:

-   `value`: User; `undefined` if user is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the user; `false` if the user was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

### Database

```javascript
import { ... } from 'react-firehooks/database';
```

#### useObject

Returns and updates the DataSnapshot of the Realtime Database query

```javascript
const [dataSnap, loading, error] = useObject(query);
```

Params:

-   `query`: Realtime Database query

Returns:

-   `value`: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useObjectOnce

Returns the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched

```javascript
const [dataSnap, loading, error] = useObjectOnce(query);
```

Params:

-   `query`: Realtime Database query

Returns:

-   `value`: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useObjectValue

Returns and updates the DataSnapshot of the Realtime Database query

```javascript
const [objectValue, loading, error] = useObjectValue(query);
```

Params:

-   `query`: Realtime Database query

Returns:

-   `value`: Object value; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useObjectValueOnce

Returns the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched

```javascript
const [objectValue, loading, error] = useObjectValueOnce(query);
```

Params:

-   `query`: Realtime Database query

Returns:

-   `value`: Object value; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

### Firestore

```javascript
import { ... } from 'react-firehooks/firestore';
```

#### useCollection

Returns and updates a QuerySnapshot of a Firestore Query

```javascript
const [querySnap, loading, error] = useCollection(query, options);
```

Params:

-   `query`: Firestore query that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useCollectionData

Returns and updates a the document data of a Firestore Query

```javascript
const [data, loading, error] = useCollectionData(query, options);
```

Params:

-   `query`: Firestore query that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: Query data; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useCollectionDataOnce

Returns the data of a Firestore Query. Does not update the data once initially fetched

```javascript
const [data, loading, error] = useCollectionDataOnce(query, options);
```

Params:

-   `query`: Firestore query that will be fetched
-   `options`: Options to configure how the query is fetched

Returns:

-   `value`: Query data; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useCollectionOnce

Returns the QuerySnapshot of a Firestore Query. Does not update the QuerySnapshot once initially fetched

```javascript
const [querySnap, loading, error] = useCollectionOnce(query, options);
```

Params:

-   `query`: Firestore query that will be fetched
-   `options`: Options to configure how the query is fetched

Returns:

-   `value`: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useDocument

Returns and updates a DocumentSnapshot of a Firestore DocumentReference

```javascript
const [documentSnap, loading, error] = useDocument(documentReference, options);
```

Params:

-   `query`: Firestore DocumentReference that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useDocumentData

Returns and updates the data of a Firestore DocumentReference

```javascript
const [data, loading, error] = useDocumentData(documentReference, options);
```

Params:

-   `query`: Firestore DocumentReference that will subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useDocumentDataOnce

Returns the data of a Firestore DocumentReference

```javascript
const [documentSnap, loading, error] = useDocumentDataOnce(documentReference, options);
```

Params:

-   `query`: Firestore DocumentReference that will be fetched
-   `options`: Options to configure the document will be fetched

Returns:

-   `value`: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

#### useDocumentOnce

Returns the DocumentSnapshot of a Firestore DocumentReference. Does not update the DocumentSnapshot once initially fetched

```javascript
const [querySnap, loading, error] = useDocumentData(documentReference, options);
```

Params:

-   `query`: Firestore DocumentReference that will be fetched
-   `options`: Options to configure how the document will be fetched

Returns:

-   `value`: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

### Storage

```javascript
import { ... } from 'react-firehooks/storage';
```

#### useDownloadURL

Returns the download URL of a Google Cloud Storage object

```javascript
const [url, loading, error] = useDownloadURL(storageReference);
```

Params:

-   `reference`: Reference to a Google Cloud Storage object

Returns:

-   `value`: Download URL; `undefined` if download URL is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the download URL; `false` if the download URL was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

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
