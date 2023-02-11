# Messaging

```javascript
import { ... } from 'react-firehooks/messaging';
```

## useMessagingToken

Returns the messaging token. The token never updates.

```javascript
const [token, loading, error] = useMessagingToken(messaging, options);
```

Params:

-   `messaging`: Firestore Messaging instance
-   `options`: Options to configure how the token will be fetched

Returns:

-   `value`: Messaging token; `undefined` if token is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the token; `false` if the token was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred
