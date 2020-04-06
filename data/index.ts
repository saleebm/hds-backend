// NOT SURE IF THIS IS NECESSARY, BUT I WAS TRYING EVERYTHING WHEN THERE WAS AN ERROR ABOUT ESMODULES AAND THIS APPEARS TO FIX IT!
import 'core-js'
import 'regenerator-runtime/runtime'
import 'esm'
import dotenv from 'dotenv'
import path from 'path'

// loading dot env from root for signing key needed in cryptoFactory
dotenv.config({ path: path.resolve('../', '.env') })
// ahh this feels nice, dynamic imports aand modules. I like that
export default import('./seed')
