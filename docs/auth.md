# Auth

```javascript
import { ... } from 'react-firehooks/auth';
```

#### useAuthIdToken

Returns and updates the JWT of the currently authenticated user

```javascript
const [idToken, loading, error] = useAuthIdToken(auth);
```

Params:

-   `auth`: Firebase Auth instance

Returns:

-   `value`: JWT; `undefined` if the JWT is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the JWT; `false` if the JWT was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useAuthIdTokenResult

Returns and updates the deserialized JWT of the currently authenticated user

```javascript
const [idToken, loading, error] = useAuthIdTokenResult(auth);
```

Params:

-   `auth`: Firebase Auth instance

Returns:

-   `value`: Deserialized JWT; `undefined` if the JWT is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the JWT; `false` if the JWT was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useAuthState

Returns and updates the currently authenticated user

```javascript
const [user, loading, error] = useAuthState(auth);
```

Params:

-   `auth`: Firebase Auth instance

Returns:

-   `value`: User; `undefined` if the user is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the user; `false` if the user was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred
