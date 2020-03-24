/**
 * Used for initial user creation
 */
import { SecurityUtils } from './security-utils'

// password utils
const encryptUserPassword = async (password: string) =>
  await SecurityUtils.encryptWithSecret(password)

const verifyUserPassword = async ({
  storedPasswordHash,
  reqBodyPassword,
}: {
  storedPasswordHash: string
  reqBodyPassword: string
}) => {
  return await SecurityUtils.checkSaltHash({
    hash: storedPasswordHash,
    password: reqBodyPassword,
  })
}

export const cryptoFactory = {
  encryptUserPassword,
  verifyUserPassword,
  generateJWTSecret: (n: number) => SecurityUtils.generateRandomString(n),
  generateDefaultSecret: () => SecurityUtils.generateRandomString(16),
}
