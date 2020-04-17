import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage, ServerResponse } from 'http'

// this is for the main App, used in the GIP on initialization of redux
export interface ServerCtx {
  req: NextApiRequest
  res: NextApiResponse
  pathname: string
}

export interface AuthPayload {
  readonly userId: number
}

// this corresponds with the GSSP/GSP ctx since Nextjs doesn't export the type explicitly...
export interface ServerSideProps {
  req: IncomingMessage
  res: ServerResponse
}
