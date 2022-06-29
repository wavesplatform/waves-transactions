/**
 * @module index
 */
import {base58Encode, blake2b, concat, signBytes, address} from '@waves/ts-lib-crypto'
import {serializePrimitives} from '@waves/marshall'

const {LONG, BASE58_STRING} = serializePrimitives
import {getSenderPublicKey, convertToPairs} from '../generic'
import {IWavesAuthParams, IWavesAuth} from '../transactions'
import {validate} from '../validators'
import {TSeedTypes} from '../types'

export const serializeWavesAuthData = (auth: { publicKey: string; timestamp: number }) => concat(
    BASE58_STRING(auth.publicKey),
    LONG(auth.timestamp)
)

export function wavesAuth(params: IWavesAuthParams, seed?: TSeedTypes, chainId?: string | number): IWavesAuth {
    const seedsAndIndexes = convertToPairs(seed)
    const publicKey = params.publicKey || getSenderPublicKey(seedsAndIndexes, {senderPublicKey: undefined})
    const timestamp = params.timestamp || Date.now()
    validate.wavesAuth({publicKey, timestamp})

    const rx = {
        hash: '',
        signature: '',
        timestamp,
        publicKey,
        address: address({publicKey}, chainId),
    }

    const bytes = serializeWavesAuthData(rx)

    rx.signature = seedsAndIndexes.map(([seed]) => signBytes(seed, bytes))[0] || ''
    rx.hash = base58Encode(blake2b(Uint8Array.from(bytes)))

    return rx
}


