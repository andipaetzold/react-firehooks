# Storage

```javascript
import { ... } from 'react-firehooks/storage';
```

## useBlob

Returns the data of a Google Cloud Storage object as a Blob

This hook is not available in Node.

```javascript
const [data, loading, error] = useBlob(storageReference);
```

Params:

-   `reference`: Reference to a Google Cloud Storage object
-   `options`: Options to configure how the object is fetched
    -   `maxDownloadSizeBytes`: If set, the maximum allowed size in bytes to retrieve.
    -   `suspense`: Whether to use React suspense-mode. Default: `false`. [Read more](docs/react-suspense.md)

Returns:

-   `value`: Object data as a Blob; `undefined` if data of the object is currently being downloaded, or an error occurred
-   `loading`: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useBytes

Returns the data of a Google Cloud Storage object

```javascript
const [data, loading, error] = useBytes(storageReference);
```

Params:

-   `reference`: Reference to a Google Cloud Storage object
-   `options`: Options to configure how the object is fetched
    -   `maxDownloadSizeBytes`: If set, the maximum allowed size in bytes to retrieve.
    -   `suspense`: Whether to use React suspense-mode. Default: `false`. [Read more](docs/react-suspense.md)

Returns:

-   `value`: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
-   `loading`: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useDownloadURL

Returns the download URL of a Google Cloud Storage object

```javascript
const [url, loading, error] = useDownloadURL(storageReference);
```

Params:

-   `reference`: Reference to a Google Cloud Storage object
-   `options`: Options to configure how the download URL is fetched
    -   `suspense`: Whether to use React suspense-mode. Default: `false`. [Read more](docs/react-suspense.md)

Returns:

-   `value`: Download URL; `undefined` if download URL is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the download URL; `false` if the download URL was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useMetadata

Returns the metadata of a Google Cloud Storage object

```javascript
const [metadata, loading, error] = useMetadata(storageReference);
```

Params:

-   `reference`: Reference to a Google Cloud Storage object
-   `options`: Options to configure how the metadata is fetched
    -   `suspense`: Whether to use React suspense-mode. Default: `false`. [Read more](docs/react-suspense.md)

Returns:

-   `value`: Metadata; `undefined` if metadata is currently being fetched, or an error occurred
-   `loading`: `true` while fetching the metadata; `false` if the metadata was fetched successfully or an error occurred
-   `error`: `undefined` if no error occurred

## useStream

Returns the data of a Google Cloud Storage object as a stream

This hook is only available in Node.

```javascript
const [data, loading, error] = useStream(storageReference);
```

Params:

-   `reference`: Reference to a Google Cloud Storage object
-   `options`: Options to configure how the object is fetched
    -   `maxDownloadSizeBytes`: If set, the maximum allowed size in bytes to retrieve.
    -   `suspense`: Whether to use React suspense-mode. Default: `false`. [Read more](docs/react-suspense.md)

Returns:

-   `value`: Object data as a stream; `undefined` if data of the object is currently being downloaded, or an error occurred
-   `loading`: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
-   `error`: `undefined` if no error occurred
