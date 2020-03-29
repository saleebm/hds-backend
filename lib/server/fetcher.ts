import fetch from 'isomorphic-unfetch'
import { KnownError } from '@Lib/server/known-errors'

export default async <T>(token: string, url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
