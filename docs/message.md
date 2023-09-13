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
    -   `getTokenOptions`: Options to configure how the token will be fetched. [Read more](https://firebase.google.com/docs/reference/js/messaging_.gettokenoptions)
    -   `suspense`: Whether to use React suspense-mode. Default: `false`. [Read more](docs/react-suspense.md)

Returns:

-   `value`: Messaging token; `undefined` if token is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the token; `false` if the token was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred
