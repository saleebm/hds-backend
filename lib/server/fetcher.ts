import fetch from 'isomorphic-unfetch'
import { KnownError } from '@Lib/server/known-errors'
import unfetch from 'isomorphic-unfetch'

export default async <T>(
  token: string,
  url?: string,
  ...args:
    | unfetch.IsomorphicBody
    | unfetch.IsomorphicHeaders
    | unfetch.IsomorphicRequest
) => {
  if (!url) {
    throw new Error('Url not provided to fetcher')
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...args,
  })

  let data
  try {
    data = await res.json()
  } catch (error) {
    // unknown server error, probably from zeit platform
  }

  if (res.status !== 200) {
    // TODO: use well-formed errors
    throw new KnownError(data.code, data.status)
  }

  return data as Promise<T>
}
