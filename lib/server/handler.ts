import some from 'lodash/some'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  isKnownError,
  isKnownErrorOfType,
  UnauthenticatedError,
  KnownError,
  NoAuthorizationHeaderError,
} from './known-errors'

const isLoudError = (error: KnownError) =>
  some(
    [UnauthenticatedError, NoAuthorizationHeaderError].map((e) =>
      isKnownErrorOfType(error, e)
    )
  )

const handleError = (res: NextApiResponse, error: Error) => {
  // silence loud errors
  if (!isKnownError(error) || !isLoudError(error)) {
    console.error('[api/error]', error)
  }

  if (isKnownError(error)) {
    res.status(error.status)
  } else {
    res.status(500)
  }

  const status = isKnownError(error) ? error.status : 500
  const code = isKnownError(error) ? error.code : 'InternalServerError'

  res.json({
    type: 'ERROR',
    status,
    code,
    message: error.message,
  })
}

const success = (res: NextApiResponse, body: any) => {
  return res.status(200).json(body)
}

type HandlerFn = (req: NextApiRequest) => Promise<any>

// wrapper function for handlers that catches errors and responds with expected format
export const handler = (handler: HandlerFn) => async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  try {
    const data = await handler(req)
    return success(res, data)
  } catch (error) {
    return handleError(res, error)
  }
}
