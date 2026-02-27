const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

type HttpMethod = 'GET' | 'POST'

async function request<T>(
  userId: string,
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `API error ${res.status}`)
  }

  if (res.status === 204) {
    // @ts-expect-error allow void
    return undefined
  }

  return (await res.json()) as T
}

export function apiGet<T>(userId: string, path: string): Promise<T> {
  return request<T>(userId, 'GET', path)
}

export function apiPost<T>(userId: string, path: string, body?: unknown): Promise<T> {
  return request<T>(userId, 'POST', path, body)
}

