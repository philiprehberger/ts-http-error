import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HttpError, isHttpError } from '../../dist/index.js';

describe('HttpError', () => {
  it('should create an error with status and default message', () => {
    const err = new HttpError(404);
    assert.equal(err.status, 404);
    assert.equal(err.message, 'Not Found');
    assert.equal(err.code, 'ERR_HTTP_404');
    assert.equal(err.name, 'HttpError');
  });

  it('should accept a custom message', () => {
    const err = new HttpError(400, 'Invalid email');
    assert.equal(err.status, 400);
    assert.equal(err.message, 'Invalid email');
  });

  it('should accept a custom code', () => {
    const err = new HttpError(422, 'Validation failed', { code: 'VALIDATION_ERROR' });
    assert.equal(err.code, 'VALIDATION_ERROR');
  });

  it('should accept a cause', () => {
    const cause = new Error('root cause');
    const err = new HttpError(500, 'Something broke', { cause });
    assert.equal(err.cause, cause);
  });

  it('should be instanceof Error', () => {
    const err = new HttpError(500);
    assert.ok(err instanceof Error);
    assert.ok(err instanceof HttpError);
  });

  describe('factory methods', () => {
    it('badRequest', () => {
      const err = HttpError.badRequest();
      assert.equal(err.status, 400);
      assert.equal(err.message, 'Bad Request');
    });

    it('unauthorized', () => {
      const err = HttpError.unauthorized();
      assert.equal(err.status, 401);
      assert.equal(err.message, 'Unauthorized');
    });

    it('forbidden', () => {
      const err = HttpError.forbidden();
      assert.equal(err.status, 403);
      assert.equal(err.message, 'Forbidden');
    });

    it('notFound', () => {
      const err = HttpError.notFound();
      assert.equal(err.status, 404);
      assert.equal(err.message, 'Not Found');
    });

    it('conflict', () => {
      const err = HttpError.conflict();
      assert.equal(err.status, 409);
    });

    it('gone', () => {
      const err = HttpError.gone();
      assert.equal(err.status, 410);
    });

    it('unprocessable', () => {
      const err = HttpError.unprocessable();
      assert.equal(err.status, 422);
    });

    it('tooMany', () => {
      const err = HttpError.tooMany();
      assert.equal(err.status, 429);
    });

    it('internal', () => {
      const err = HttpError.internal();
      assert.equal(err.status, 500);
      assert.equal(err.message, 'Internal Server Error');
    });

    it('notImplemented', () => {
      const err = HttpError.notImplemented();
      assert.equal(err.status, 501);
    });

    it('badGateway', () => {
      const err = HttpError.badGateway();
      assert.equal(err.status, 502);
    });

    it('unavailable', () => {
      const err = HttpError.unavailable();
      assert.equal(err.status, 503);
    });

    it('factory with custom message', () => {
      const err = HttpError.notFound('User not found');
      assert.equal(err.status, 404);
      assert.equal(err.message, 'User not found');
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const err = new HttpError(404, 'Not Found');
      const json = err.toJSON();
      assert.deepEqual(json, {
        status: 404,
        message: 'Not Found',
        code: 'ERR_HTTP_404',
      });
    });
  });

  describe('isHttpError', () => {
    it('should return true for HttpError instances', () => {
      assert.equal(isHttpError(new HttpError(404)), true);
    });

    it('should return false for plain errors', () => {
      assert.equal(isHttpError(new Error('nope')), false);
    });

    it('should return false for non-errors', () => {
      assert.equal(isHttpError('not an error'), false);
      assert.equal(isHttpError(null), false);
      assert.equal(isHttpError(undefined), false);
    });

    it('should filter by status code', () => {
      const err = new HttpError(404);
      assert.equal(isHttpError(err, 404), true);
      assert.equal(isHttpError(err, 500), false);
    });
  });
});
