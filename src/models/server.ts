import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export interface ServerCtx {
  req: NextApiRequest
  res: NextApiResponse
  pathname: string
}

export interface GetKeysReturnType {
  privateKey: string
  publicKey: string
}
export interface CryptoLocker {
  _readFile: Promise<typeof fs.readFile>
  getKeys: () => Promise<GetKeysReturnType>
}
