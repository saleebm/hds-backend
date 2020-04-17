import fetch from 'isomorphic-unfetch'
import { KnownError } from './known-errors'
import { authService } from '@Services'
import { ServerCtx, ServerSideProps } from '@Types'

/**
 * TODO it would be nice to learn about the AbortController, try to integrate that later on
 * @param url
 * @param body
 * @param ctx
 */
export default async <
  DataTypeResponse,
  PostBody extends Record<string, any> = {}
>(
  url: string,
  body?: PostBody,
  ctx?: ServerCtx | ServerSideProps
) => {
  const token = authService.getAccessToken(ctx)
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body || {}),
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

  return data as DataTypeResponse
}
