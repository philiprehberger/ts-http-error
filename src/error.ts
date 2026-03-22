export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message?: string, options?: { code?: string; cause?: unknown }) {
    super(message ?? defaultMessage(status));
    this.name = 'HttpError';
    this.status = status;
    this.code = options?.code ?? `ERR_HTTP_${status}`;
    if (options?.cause) this.cause = options.cause;
  }

  toJSON(): { status: number; message: string; code: string } {
    return { status: this.status, message: this.message, code: this.code };
  }

  static badRequest(message?: string) { return new HttpError(400, message); }
  static unauthorized(message?: string) { return new HttpError(401, message); }
  static forbidden(message?: string) { return new HttpError(403, message); }
  static notFound(message?: string) { return new HttpError(404, message); }
  static conflict(message?: string) { return new HttpError(409, message); }
  static gone(message?: string) { return new HttpError(410, message); }
  static unprocessable(message?: string) { return new HttpError(422, message); }
  static tooMany(message?: string) { return new HttpError(429, message); }
  static internal(message?: string) { return new HttpError(500, message); }
  static notImplemented(message?: string) { return new HttpError(501, message); }
  static badGateway(message?: string) { return new HttpError(502, message); }
  static unavailable(message?: string) { return new HttpError(503, message); }
}

function defaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
    404: 'Not Found', 409: 'Conflict', 410: 'Gone',
    422: 'Unprocessable Entity', 429: 'Too Many Requests',
    500: 'Internal Server Error', 501: 'Not Implemented',
    502: 'Bad Gateway', 503: 'Service Unavailable',
  };
  return messages[status] ?? 'Unknown Error';
}

export function isHttpError(err: unknown): err is HttpError;
export function isHttpError(err: unknown, status: number): err is HttpError;
export function isHttpError(err: unknown, status?: number): err is HttpError {
  if (!(err instanceof HttpError)) return false;
  return status === undefined || err.status === status;
}
