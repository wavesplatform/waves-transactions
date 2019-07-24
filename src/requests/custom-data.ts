/**
 * @module index
 */
import { signBytes, blake2b, base58Encode, base64Decode, publicKey } from '@waves/ts-lib-crypto'
import { schemas, serializePrimitives } from '@waves/marshall'
import { IDataEntry } from '../transactions'
import { serializerFromSchema } from '@waves/marshall/dist/serialize'

export interface ICustomDataV1 {
  version: 1
  /**
   * base64 encoded UInt8Array
   */
  binary: string // base64
}

export interface ICustomDataV2 {
  version: 2
  data: IDataEntry[]
}

export type TCustomData = ICustomDataV1 | ICustomDataV2

export type TSignedData = TCustomData & {
  /**
   * base58 public key
   */
  publicKey: string
  /**
   * base58 encoded blake2b(serialized data)
   */
  hash: string
  /**
   * base58 encoded signature
   */
  signature: string
}

/**
 * Signs [[TCustomData]]
 */
export function customData(cData: TCustomData, seed: string): TSignedData {

  let bytes = serializeCustomData(cData)

  const hash = base58Encode(blake2b(bytes))
  const pk = publicKey(seed)

  const signature = signBytes(seed, bytes)

  return {...cData, hash, publicKey: pk, signature}
}

export function serializeCustomData(d: TCustomData){
  if (d.version === 1) {
    return serializePrimitives.BASE64_STRING(d.binary)
  } else if (d.version === 2) {
    const ser = serializerFromSchema(schemas.txFields.data[1])
    return ser(d.data)
  } else {
    throw new Error(`Invalid CustomData version: ${d!.version}`)
  }
}
