import fetch from 'isomorphic-unfetch'
import { KnownError } from './known-errors'
import { authService } from '@Services'
import { ServerCtx } from '@Types'

export default async (
  url: string,
  body: Record<string, any> = {},
  ctx?: ServerCtx
) => {
  const token = authService.getAccessToken(ctx)
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    mode: 'same-origin',
  })

  let data
  try {
    data = await res.json()
  } catch (error) {
    console.error(error)
  }

  if (data.type && data.type === 'ERROR') {
    throw new KnownError(data.code, data.status)
  }

  return data
}
