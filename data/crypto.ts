import { promisify } from 'util'
import path from 'path'
import { readFile } from 'fs'
import dotenv from 'dotenv'
// noinspection TypeScriptPreferShortImport
import { SecurityUtils } from '../src/utils/crypto'

dotenv.config()

const keyFilePath = path.resolve('keys', 'key.pem')

const _readFile = promisify(readFile)

const SIGNING_SECRET = process.env.TOKEN_SIGNING_SECRET

// jwt utils
async function createUserJWTSecret() {
  if (!SIGNING_SECRET) {
    throw new Error('env is not parsed properly. missing TOKEN_SIGNING_SECRET')
  }
  const privateKey = await _readFile(keyFilePath)
  const encryptWithSecret = SecurityUtils.encryptWithSecret(
    privateKey,
    SIGNING_SECRET
  )

  const jwtUserSecret = await SecurityUtils.hashWithBcrypt(encryptWithSecret)
  // 60kb
  console.log(jwtUserSecret.length)
  if (jwtUserSecret.length > 60) {
    throw new Error(
      'user secret is too long man! misconfiguration! should have unit tests!'
    )
  }
  return {
    jwtUserSecret,
  }
}

export const jwtOptionsFactory = {
  createUserJWTSecret,
}

// password utils
const encryptUserPassword = async (password: string) =>
  await SecurityUtils.hashWithBcrypt(password)

const verifyUserPassword = async ({
  storedPasswordHash,
  reqBodyPassword,
}: {
  storedPasswordHash: string
  reqBodyPassword: string
}) => await SecurityUtils.bcryptHashIsValid(reqBodyPassword, storedPasswordHash)

export const passwordFactory = {
  encryptUserPassword,
  verifyUserPassword,
}
