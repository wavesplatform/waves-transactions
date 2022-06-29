/**
 * @module index
 */
import { signBytes, blake2b, base58Encode, publicKey, concat, TSeed } from '@waves/ts-lib-crypto'
import { schemas, serializePrimitives } from '@waves/marshall'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { TPrivateKey } from '../types'
import {DataFiledType, DataTransactionEntry} from '@waves/ts-types'
import {DataTransactionDeleteRequest} from '@waves/ts-types/src/parts'

export interface ICustomDataV1 {
  version: 1
  /**
   * base64 encoded UInt8Array
   */
  binary: string // base64

  publicKey?: string
}

export interface ICustomDataV2 {
  version: 2
  data: Exclude<DataTransactionEntry, DataTransactionDeleteRequest>[]
  publicKey?: string
}

export type TCustomData = ICustomDataV1 | ICustomDataV2

export type TSignedData = TCustomData & {
  /**
   * base58 public key
   */
  publicKey: string | undefined
  /**
   * base58 encoded blake2b(serialized data)
   */
  hash: string
  /**
   * base58 encoded signature
   */
  signature: string | undefined
}

/**
 * Signs [[TCustomData]]
 */
export function customData(cData: TCustomData, seed?: TSeed | TPrivateKey): TSignedData {

  validate.customData(cData)

  let bytes = serializeCustomData(cData)

  const hash = base58Encode(blake2b(bytes))

  const pk = cData.publicKey ? cData.publicKey : seed && publicKey(seed)

  const signature = seed && signBytes(seed, bytes)

  return {...cData, hash, publicKey: pk, signature}
}

export function serializeCustomData(d: TCustomData){
  if (d.version === 1) {
    return concat([255, 255, 255, 1], serializePrimitives.BASE64_STRING(d.binary))
  } else if (d.version === 2) {
    const ser = binary.serializerFromSchema(schemas.txFields.data[1])
    return concat([255, 255, 255, 2], ser(d.data))
  } else {
    //@ts-ignore
    throw new Error(`Invalid CustomData version: ${d!.version}`)
  }
}
