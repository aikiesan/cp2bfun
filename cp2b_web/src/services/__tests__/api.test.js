/**
 * ApiClient unit tests
 *
 * Teaching notes for grad students:
 * - The ApiClient class wraps the browser's native `fetch` API. We cannot let
 *   real network requests fire in tests (slow, fragile, requires a running server).
 * - Instead we use `vi.stubGlobal('fetch', mockFn)` to replace `fetch` with a
 *   controlled spy for each test, then restore globals afterwards.
 * - Each test follows the AAA pattern:
 *     Arrange — set up mocks and inputs
 *     Act     — call the code under test
 *     Assert  — verify the outcome
 * - We also test error paths (non-ok HTTP responses) to ensure the client
 *   surfaces useful error information to callers.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Builds a minimal Response-like object that the ApiClient expects from fetch.
 * `ok: true` = 2xx status; `ok: false` = 4xx/5xx.
 */
function makeFetchResponse({ ok = true, body = {} } = {}) {
  return {
    ok,
    status: ok ? 200 : 400,
    json: () => Promise.resolve(body),
  };
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe('ApiClient', () => {
  // Re-import the module fresh before each test so that module-level state
  // (like the API_URL constant derived from import.meta.env) doesn't leak.
  let api;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import('../api.js');
    api = module.default;
  });

  afterEach(() => {
    // Always clean up stubbed globals so other test files aren't affected.
    vi.unstubAllGlobals();
  });

  // ── GET ──────────────────────────────────────────────────────────────────────

  describe('get()', () => {
    it('calls fetch with the correct URL and GET method', async () => {
      const fetchMock = vi.fn().mockResolvedValue(makeFetchResponse({ body: [] }));
      vi.stubGlobal('fetch', fetchMock);

      await api.get('/news');

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toContain('/news');
      expect(options.method).toBe('GET');
    });

    it('returns { data } wrapping the parsed JSON body', async () => {
      const payload = [{ id: 1, title: 'Test news' }];
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeFetchResponse({ body: payload })));

      const result = await api.get('/news');

      expect(result).toEqual({ data: payload });
    });

    it('sets the Content-Type header to application/json', async () => {
      const fetchMock = vi.fn().mockResolvedValue(makeFetchResponse());
      vi.stubGlobal('fetch', fetchMock);

      await api.get('/team');

      const options = fetchMock.mock.calls[0][1];
      expect(options.headers['Content-Type']).toBe('application/json');
    });
  });

  // ── POST ─────────────────────────────────────────────────────────────────────

  describe('post()', () => {
    it('serializes a plain object body to JSON', async () => {
      const fetchMock = vi.fn().mockResolvedValue(makeFetchResponse({ body: { id: 42 } }));
      vi.stubGlobal('fetch', fetchMock);

      const payload = { name: 'Test User', email: 'test@example.com' };
      await api.post('/contact', payload);

      const options = fetchMock.mock.calls[0][1];
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual(payload);
      expect(options.headers['Content-Type']).toBe('application/json');
    });

    it('does NOT set Content-Type when body is FormData (multipart)', async () => {
      // The browser must set the Content-Type boundary automatically for
      // multipart/form-data — if we set it manually, the upload breaks.
      const fetchMock = vi.fn().mockResolvedValue(makeFetchResponse({ body: { url: '/img.jpg' } }));
      vi.stubGlobal('fetch', fetchMock);

      const formData = new FormData();
      formData.append('image', new Blob(['data'], { type: 'image/jpeg' }), 'photo.jpg');
      await api.post('/upload', formData);

      const options = fetchMock.mock.calls[0][1];
      expect(options.headers['Content-Type']).toBeUndefined();
    });
  });

  // ── PUT ──────────────────────────────────────────────────────────────────────

  describe('put()', () => {
    it('calls fetch with PUT method and serialized body', async () => {
      const fetchMock = vi.fn().mockResolvedValue(makeFetchResponse({ body: { updated: true } }));
      vi.stubGlobal('fetch', fetchMock);

      await api.put('/news/1', { title_pt: 'Novo título' });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toContain('/news/1');
      expect(options.method).toBe('PUT');
      expect(JSON.parse(options.body)).toMatchObject({ title_pt: 'Novo título' });
    });
  });

  // ── DELETE ───────────────────────────────────────────────────────────────────

  describe('delete()', () => {
    it('calls fetch with DELETE method and the correct endpoint', async () => {
      const fetchMock = vi.fn().mockResolvedValue(makeFetchResponse({ body: { deleted: true } }));
      vi.stubGlobal('fetch', fetchMock);

      await api.delete('/news/99');

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toContain('/news/99');
      expect(options.method).toBe('DELETE');
    });
  });

  // ── Error handling ───────────────────────────────────────────────────────────

  describe('error handling', () => {
    it('throws an Error when the response status is not ok (e.g. 404)', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(makeFetchResponse({ ok: false, body: { error: 'Not found' } }))
      );

      await expect(api.get('/no-such-endpoint')).rejects.toThrow('Not found');
    });

    it('attaches response status and data to the thrown error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 422,
          json: () => Promise.resolve({ error: 'Validation failed' }),
        })
      );

      let caughtError;
      try {
        await api.post('/news', {});
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeDefined();
      expect(caughtError.message).toBe('Validation failed');
      expect(caughtError.response.status).toBe(422);
      expect(caughtError.response.data).toMatchObject({ error: 'Validation failed' });
    });

    it('falls back gracefully when the error body is not valid JSON', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.reject(new SyntaxError('Invalid JSON')),
        })
      );

      // The ApiClient should still throw an Error (with a generic message),
      // not an unhandled Promise rejection.
      await expect(api.get('/broken')).rejects.toThrow('Request failed');
    });
  });
});
