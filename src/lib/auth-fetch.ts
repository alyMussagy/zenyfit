/**
 * Wrapper around fetch that attaches the admin Authorization header.
 * Reads the admin email from localStorage and sends as Bearer token.
 */
export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let adminEmail = '';
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('zenyfit-admin');
      if (stored) {
        const admin = JSON.parse(stored);
        adminEmail = admin.email || '';
      }
    } catch {
      // ignore
    }
  }

  const headers = new Headers(options.headers || {});
  if (adminEmail) {
    headers.set('Authorization', `Bearer ${adminEmail}`);
  }
  // Preserve content-type for JSON bodies
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...options, headers });
}