import { NextApiRequest } from 'next'
import { IncomingMessage } from 'http'

export default function getApiHostUrl(
  req: NextApiRequest | IncomingMessage
): string {
  if (!req.headers) {
    return ''
  }
  const host = (req.headers.host as string) || ''

  if (host.startsWith('localhost')) {
    return `http://${host}`
  }

  return `https://${host}`
}
