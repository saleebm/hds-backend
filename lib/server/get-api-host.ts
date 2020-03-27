import { NextApiRequest } from 'next'

export default function getApiHostUrl(req: NextApiRequest): string {
  if (!req.headers) {
    return ''
  }
  const host = (req.headers.host as string) || ''

  if (host.startsWith('localhost')) {
    return `http://${host}`
  }

  return `https://${host}`
}
