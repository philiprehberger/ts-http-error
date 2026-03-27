# @philiprehberger/http-error

[![CI](https://github.com/philiprehberger/ts-http-error/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-http-error/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/http-error)](https://www.npmjs.com/package/@philiprehberger/http-error)
[![License](https://img.shields.io/github/license/philiprehberger/ts-http-error)](LICENSE)
[![Sponsor](https://img.shields.io/badge/sponsor-GitHub%20Sponsors-ec6cb9)](https://github.com/sponsors/philiprehberger)

Typed HTTP error classes with status codes, factory methods, and serialization.

## Installation

```bash
npm install @philiprehberger/http-error
```

## Usage

```ts
import { HttpError, isHttpError } from '@philiprehberger/http-error';

// Factory methods
throw HttpError.notFound('User not found');
throw HttpError.badRequest('Invalid email');
throw HttpError.internal();

// Constructor
throw new HttpError(409, 'Already exists', { code: 'DUPLICATE' });

// Type guard
try {
  await fetchUser(id);
} catch (err) {
  if (isHttpError(err, 404)) {
    // handle not found
  }
}

// Serialization
const err = HttpError.badRequest('Invalid input');
console.log(JSON.stringify(err));
// {"status":400,"message":"Invalid input","code":"ERR_HTTP_400"}
```

## API

### `new HttpError(status, message?, options?)`

Creates an HTTP error instance.

| Param              | Type      | Description                          |
| ------------------ | --------- | ------------------------------------ |
| `status`           | `number`  | HTTP status code                     |
| `message`          | `string`  | Error message (defaults by status)   |
| `options.code`     | `string`  | Machine-readable code                |
| `options.cause`    | `unknown` | Underlying cause                     |

### Factory Methods

`badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `gone`, `unprocessable`, `tooMany`, `internal`, `notImplemented`, `badGateway`, `unavailable`

### `isHttpError(err): err is HttpError`
### `isHttpError(err, status): err is HttpError`

Type guard that checks if a value is an `HttpError`, optionally matching a specific status code.

### `toJSON(): { status, message, code }`

Serializes the error for API responses.

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
