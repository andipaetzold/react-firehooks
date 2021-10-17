# Migrate from `react-firebase-hooks`

This document explains the difference between [`react-firebase-hooks`](https://www.npmjs.com/package/react-firebase-hooks) and `react-firehooks`.

## Auth

-   `useCreateUserWithEmailAndPassword` was removed. Use `createUserWithEmailAndPassword` directly from `firebase/auth`.

-   `useSignInWithEmailAndPassword` was removed. Use `signInWithEmailAndPassword` directly from `firebase/auth`.

## Database

-   `useListKeys` was removed. Use `useObjectValue` with `options.converter`.
-   `useListVals` was removed. Use `useObjectValue` with `options.converter`.
-   `useObjectVal` was renamed to `useObjectValue`
-   `useObjectValOnce` was renamed to `useObjectValueOnce`
-   `options.keyField` was removed. Use `options.converter` instead.
-   `options.refField` was removed. Use `options.converter` instead.
-   `options.transform` was removed. Use `options.converter` instead.

## Firestore

-   `options.getOptions.source` was moved to `options.source`
-   `options.idField` was removed. Use [Firestore Converters](https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter) instead.
-   `options.refField` was removed. Use [Firestore Converters](https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter) instead.
-   `options.transform` was removed. Use [Firestore Converters](https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter) instead.

## Storage

-   No changes

## Other

-   The library doesn't include types for [Flow](https://flow.org/)
