# App Check

```javascript
import { ... } from 'react-firehooks/app-check';
```

## useAppCheckToken

Returns and updates the current App Check token

```javascript
const [user, loading, error] = useAppCheckToken(auth);
```

Params:

-   `appCheck`: Firebase App Check instance

Returns:

-   `value`: App Check token; `undefined` if the token is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the token; `false` if the token was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred
