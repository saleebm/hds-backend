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
  generateJWTSecret: (n: number) =>
    SecurityUtils.generateRandomString(
      n
    ) /* pass in argument here bc jwt secret can afford to be a little longer than default secret */,
  generateDefaultSecret: () =>
    SecurityUtils.generateRandomString(
      16
    ) /* it won't go much higher than this. the password max length in the database is about 81 characters like this */,
}
