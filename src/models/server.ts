import { NextApiRequest, NextApiResponse } from 'next'

export interface ServerCtx {
  req: NextApiRequest
  res: NextApiResponse
  pathname: string
}

export interface AuthPayload {
  readonly email: string
}
