# Firestore

```javascript
import { ... } from 'react-firehooks/firestore';
```

#### useAggregateFromServer

Returns aggregate of a Firestore Query. Does not update the result once initially calculated.

```javascript
const [data, loading, error] = useAggregateFromServer(query, aggregateSpec);
```

Params:

-   `query`: Firestore query the aggregate is calculated for
-   `aggregateSpec`: Aggregate specification

Returns:

-   `value`: Aggregate of the Firestore query; `undefined` if the aggregate is currently being calculated, or an error occurred
-   `loading`: `true` while calculating the aggregate; `false` if the aggregate was calculated successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useQuery

Returns and updates a QuerySnapshot of a Firestore Query

```javascript
const [querySnap, loading, error] = useQuery(query, options);
```

Params:

-   `query`: Firestore query that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useQueryData

Returns and updates a the document data of a Firestore Query

```javascript
const [data, loading, error] = useQueryData(query, options);
```

Params:

-   `query`: Firestore query that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: Query data; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useQueryDataOnce

Returns the data of a Firestore Query. Does not update the data once initially fetched

```javascript
const [data, loading, error] = useQueryDataOnce(query, options);
```

Params:

-   `query`: Firestore query that will be fetched
-   `options`: Options to configure how the query is fetched

Returns:

-   `value`: Query data; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useQueryOnce

Returns the QuerySnapshot of a Firestore Query. Does not update the QuerySnapshot once initially fetched

```javascript
const [querySnap, loading, error] = useQueryOnce(query, options);
```

Params:

-   `query`: Firestore query that will be fetched
-   `options`: Options to configure how the query is fetched

Returns:

-   `value`: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useCountFromServer

Returns the number of documents in the result set of of a Firestore Query. Does not update the count once initially calculated.

```javascript
const [count, loading, error] = useCountFromServer(query);
```

Params:

-   `query`: Firestore query whose result set size is calculated

Returns:

-   `value`: Size of the result set; `undefined` if the result set size is currently being calculated, or an error occurred
-   `loading`: `true` while calculating the result size set; `false` if the result size set was calculated successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useDocument

Returns and updates a DocumentSnapshot of a Firestore DocumentReference

```javascript
const [documentSnap, loading, error] = useDocument(documentReference, options);
```

Params:

-   `documentReference`: Firestore DocumentReference that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useDocumentData

Returns and updates the data of a Firestore DocumentReference

```javascript
const [data, loading, error] = useDocumentData(documentReference, options);
```

Params:

-   `documentReference`: Firestore DocumentReference that will subscribed to
-   `options`: Options to configure the subscription

Returns:

-   `value`: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useDocumentDataOnce

Returns the data of a Firestore DocumentReference

```javascript
const [documentSnap, loading, error] = useDocumentDataOnce(documentReference, options);
```

Params:

-   `documentReference`: Firestore DocumentReference that will be fetched
-   `options`: Options to configure the document will be fetched

Returns:

-   `value`: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useDocumentOnce

Returns the DocumentSnapshot of a Firestore DocumentReference. Does not update the DocumentSnapshot once initially fetched

```javascript
const [querySnap, loading, error] = useDocumentData(documentReference, options);
```

Params:

-   `documentReference`: Firestore DocumentReference that will be fetched
-   `options`: Options to configure how the document will be fetched

Returns:

-   `value`: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useQueries

Returns and updates a QuerySnapshot of multiple Firestore queries

```javascript
const [querySnap, loading, error] = useQueries(queries, options);
```

Params:

-   `queries`: Firestore queries that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   Array with tuple for each query:
    -   `value`: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
    -   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
    -   `error`: `undefined` if no error occurred

## useQueriesData

Returns and updates a the document data of multiple Firestore queries

```javascript
const [querySnap, loading, error] = useQueriesData(query, options);
```

Params:

-   `queries`: Firestore queries that will be subscribed to
-   `options`: Options to configure the subscription

Returns:

-   Array with tuple for each query:
    -   `value`: Query data; `undefined` if query is currently being fetched, or an error occurred
    -   `loading` :`true` while fetching the query; `false` if the query was fetched successfully or an error occurred
    -   `error`: `undefined` if no error occurred
