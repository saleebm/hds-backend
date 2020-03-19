import crypto, { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'

// Background:
// https://security.stackexchange.com/questions/184305/why-would-i-ever-use-aes-256-cbc-if-aes-256-gcm-is-more-secure

const CIPHER_ALGORITHM = `aes-256-gcm`,
  CIPHER_KEY_LENGTH = 32, // https://stackoverflow.com/a/28307668/4397028
  CIPHER_IV_LENGTH = 16, // https://stackoverflow.com/a/28307668/4397028
  CIPHER_TAG_LENGTH = 16,
  CIPHER_SALT_LENGTH = 64

const PBKDF2_ITERATIONS = 100_000 // https://support.1password.com/pbkdf2/

// rounds=12: 2-3 hashes/sec on  2GHZ
// @see https://www.npmjs.com/package/bcrypt#a-note-on-rounds
const SALT_ROUNDS = 12
/**
 * todo make this server only to reduce client bundle size
 * encrypt the user password into the database
 * @param secret
 * @param data
 */
export const SecurityUtils = {
  hashWithBcrypt: async (str: string) => await bcrypt.hash(str, SALT_ROUNDS),
  bcryptHashIsValid: async (value: string, hash: string) =>
    await bcrypt.compare(value, hash),

  generateRandomString: async (chars: number): Promise<string> => {
    const buffer = await randomBytes(chars / 2)
    return buffer.toString('hex')
  },

  decryptWithSecret(secret: Buffer, encryptedData: string) {
    const buffer = Buffer.from(encryptedData, `hex`)

    const salt = buffer.slice(0, CIPHER_SALT_LENGTH)
    const iv = buffer.slice(
      CIPHER_SALT_LENGTH,
      CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH
    )
    const tag = buffer.slice(
      CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH,
      CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH + CIPHER_TAG_LENGTH
    )
    const encrypted = buffer.slice(
      CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH + CIPHER_TAG_LENGTH
    )

    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    const key = crypto.pbkdf2Sync(
      secret,
      salt,
      PBKDF2_ITERATIONS,
      CIPHER_KEY_LENGTH,
      `sha512`
    )

    const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    return decipher.update(encrypted) + decipher.final(`utf8`)
  },
  encryptWithSecret(secret: Buffer, data: string) {
    const iv = crypto.randomBytes(CIPHER_IV_LENGTH)
    const salt = crypto.randomBytes(CIPHER_SALT_LENGTH)

    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    const key = crypto.pbkdf2Sync(
      secret,
      salt,
      PBKDF2_ITERATIONS,
      CIPHER_KEY_LENGTH,
      `sha512`
    )

    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv)
    const encrypted = Buffer.concat([
      cipher.update(data, `utf8`),
      cipher.final(),
    ])

    // https://nodejs.org/api/crypto.html#crypto_cipher_getauthtag
    const tag = cipher.getAuthTag()

    return Buffer.concat([
      // Data as required by:
      // Salt for Key: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
      // IV: https://nodejs.org/api/crypto.html#crypto_class_decipher
      // Tag: https://nodejs.org/api/crypto.html#crypto_decipher_setauthtag_buffer
      salt,
      iv,
      tag,
      encrypted,
    ]).toString(`hex`)
  },
}
