# Database

```javascript
import { ... } from 'react-firehooks/database';
```

## useObject

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

## useObjectOnce

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

## useObjectValue

Returns and updates the DataSnapshot of the Realtime Database query

```javascript
const [objectValue, loading, error] = useObjectValue(query, options);
```

Params:

-   `query`: Realtime Database query
-   `options`: Options to configure how the object is fetched
    -   `converter`: Function to extract the desired data from the DataSnapshot. Similar to Firestore converters. Default: `snap.val()`.

Returns:

-   `value`: Object value; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useObjectValueOnce

Returns the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched

```javascript
const [objectValue, loading, error] = useObjectValueOnce(query, options);
```

Params:

-   `query`: Realtime Database query
-   `options`: Options to configure how the object is fetched
    -   `converter`: Function to extract the desired data from the DataSnapshot. Similar to Firestore converters. Default: `snap.val()`.

Returns:

-   `value`: Object value; `undefined` if query is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred
