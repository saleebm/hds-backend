/*
 * I totally took this file from next js server utils, and modified it a little bit for my own interests.
 * Thank you to the NextJS team, and I learned a lot about encryption from implementing this
 */
import crypto from 'crypto'
import { promisify } from 'util'
import { resolve } from 'path'
import { readFile } from 'fs'

const cryptoPbkdf2 = promisify(crypto.pbkdf2)

// make sure private key is there
const keyFilePath = resolve('keys', 'key.pem')

const _readFile = promisify(readFile)

// https://security.stackexchange.com/questions/184305/why-would-i-ever-use-aes-256-cbc-if-aes-256-gcm-is-more-secure
const CIPHER_ALGORITHM = `aes-256-gcm`,
  CIPHER_KEY_LENGTH = 32, // https://stackoverflow.com/a/28307668/4397028
  CIPHER_IV_LENGTH = 16,
  CIPHER_TAG_LENGTH = 16,
  CIPHER_SALT_LENGTH = 8, // https://stackoverflow.com/questions/184112/what-is-the-optimal-length-for-user-password-salt
  PBKDF2_ITERATIONS = 10

/**
 * encrypt the user password into the database
 * @param secret
 * @param data
 */
export const SecurityUtils = {
  getPrivateKey: async (): Promise<Buffer> => await _readFile(keyFilePath),
  generateRandomString: async (chars: number): Promise<string> => {
    const buffer = await crypto.randomBytes(chars / 2)
    return buffer.toString('hex')
  },
  /**
   * the tool to match the req body password to the hash in db
   * @param password  req body pw
   * @param hash stored in db
   */
  async checkSaltHash({ password, hash }: { password: string; hash: string }) {
    const privateKey = await this.getPrivateKey()
    if (!privateKey) {
      throw new Error('Private key not found')
    }

    const secret = Buffer.from(privateKey)

    const buffer = Buffer.from(hash, 'hex')

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

    const key = await cryptoPbkdf2(
      secret,
      salt,
      PBKDF2_ITERATIONS,
      CIPHER_KEY_LENGTH,
      'sha512'
    )
    const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    const userPasswordUnhashed =
      decipher.update(encrypted) + decipher.final(`utf8`)

    return userPasswordUnhashed === password
  },
  /**
   * encrypts with crypto
   * @param data The data to encrypt
   * @return the salt used to encrypt the secret, and hash, the secret encrypted
   */
  async encryptWithSecret(data: string): Promise<{ passwordHash: string }> {
    const privateKey = await this.getPrivateKey()
    const secret = Buffer.from(privateKey)

    const iv = crypto.randomBytes(CIPHER_IV_LENGTH)
    const salt = crypto.randomBytes(CIPHER_SALT_LENGTH)

    const key = await cryptoPbkdf2(
      secret,
      salt,
      PBKDF2_ITERATIONS,
      CIPHER_KEY_LENGTH,
      'sha512'
    )

    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv)
    const encrypted = Buffer.concat([
      cipher.update(data, `utf8`),
      cipher.final(),
    ])

    // https://nodejs.org/api/crypto.html#crypto_cipher_getauthtag
    const tag = cipher.getAuthTag()

    // CYPHER_TAG_LENGTH
    // console.log(tag.length)

    return {
      passwordHash: Buffer.concat([
        // Data as required by:
        // Salt for Key: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
        // IV: https://nodejs.org/api/crypto.html#crypto_class_decipher
        // Tag: https://nodejs.org/api/crypto.html#crypto_decipher_setauthtag_buffer
        salt,
        iv,
        tag,
        encrypted,
      ]).toString(`hex`),
    }
  },
}
