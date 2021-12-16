/**
 * @module index
 */
import { base58Encode, blake2b, concat, signBytes, address } from '@waves/ts-lib-crypto'
import { serializePrimitives } from '@waves/marshall'
const {STRING, LEN, SHORT} = serializePrimitives
import { getSenderPublicKey, convertToPairs } from '../generic'
import { IAuthParams, IAuth } from '../transactions'
import { validate } from '../validators'
import { TPrivateKey } from '../types'

export const serializeAuthData = (auth: {host: string, data: string}) => concat(
    LEN(SHORT)(STRING)('WavesWalletAuthentication'),
    LEN(SHORT)(STRING)(auth.host || ''),
    LEN(SHORT)(STRING)(auth.data || '')
)

export function auth(params: IAuthParams, seed?: string | TPrivateKey, chainId?: string|number): IAuth {

  const seedsAndIndexes = convertToPairs(seed)
  const publicKey = params.publicKey || getSenderPublicKey(seedsAndIndexes, {senderPublicKey: undefined})

  validate.auth(params)

  const rx = {
    hash: '',
    signature: '',
    host: params.host,
    data: params.data,
    publicKey,
    address: address({ publicKey }, chainId),
  }

  const bytes = serializeAuthData(rx)

  rx.signature = ( seed != null && signBytes(seed, bytes)) || ''
  rx.hash =  base58Encode(blake2b(Uint8Array.from(bytes)))

  return rx
}


