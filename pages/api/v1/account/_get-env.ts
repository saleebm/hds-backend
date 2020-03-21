/**
 * anything prefixed with _ will not be in api
 * simple env util to reduce redundancy
 */
export const getEnv = () => {
  const signingSignature = process.env.TOKEN_SIGNING_SECRET
  // token signing secret must be in env
  if (!signingSignature) {
    throw new Error('Server misconfiguration')
  }

  return {
    signingSignature,
  }
}
