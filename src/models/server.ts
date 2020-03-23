import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage, ServerResponse } from 'http'

export interface ServerCtx {
  req: NextApiRequest
  res: NextApiResponse
  pathname: string
}

export interface AuthPayload {
  readonly userId: number
}

export interface ServerSideProps {
  req: IncomingMessage
  res: ServerResponse
}
