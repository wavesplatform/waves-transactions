import {
  BASE58_STRING, BASE64_STRING,
  BYTE,
  BYTES,
  concat,
  COUNT,
  hashBytes,
  LEN,
  LONG,
  serializer,
  SHORT,
  signBytes,
  STRING
} from 'waves-crypto'
import { DataTransaction, TransactionType, DataEntry, DataType } from '../transactions'
import { addProof, getSenderPublicKey, mapSeed, pullSeedAndIndex, valOrDef } from '../generic'
import { Params, SeedTypes } from '../types'
import { ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export interface TypelessDataEntry {
  key: string
  value: string | number | boolean | Buffer | Uint8Array | number[]
}

export interface DataParams extends Params {
  data: Array<DataEntry | TypelessDataEntry>
  fee?: number,
  timestamp?: number
}

const typeMap: any = {
  integer: ['integer', 0, LONG],
  number: ['integer', 0, LONG],
  boolean: ['boolean', 1, BYTE],
  string: ['string', 3, LEN(SHORT)(STRING)],
  binary: ['binary', 2, (s:string) => LEN(SHORT)(BASE64_STRING)(s.slice(7))], // Slice base64: part
  _: ['binary', 2, LEN(SHORT)(BYTES)],
}

const mapType = <T>(value: T): [DataType, number, serializer<T>] =>
  typeMap[typeof value] || typeMap['_']

export const dataValidation = (tx: DataTransaction): ValidationResult => []

export const dataToBytes = (tx: DataTransaction): Uint8Array => concat(
  BYTE(TransactionType.Data),
  BYTE(1),
  BASE58_STRING(tx.senderPublicKey),
  COUNT(SHORT)((x: DataEntry) => concat(LEN(SHORT)(STRING)(x.key), [typeMap[x.type][1]], typeMap[x.type][2](x.value)))(tx.data),
  LONG(tx.timestamp),
  LONG(tx.fee)
)

/* @echo DOCS */
export function data(paramsOrTx: DataParams | DataTransaction, seed?: SeedTypes): DataTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { data: _data, fee, timestamp } = paramsOrTx

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  if (! Array.isArray(_data)) throw new Error('["data should be array"]')

  const _timestamp = valOrDef(timestamp, Date.now())

  let bytes = concat(
    BYTE(TransactionType.Data),
    BYTE(1),
    BASE58_STRING(senderPublicKey),
    COUNT(SHORT)((x: DataEntry | TypelessDataEntry) => concat(LEN(SHORT)(STRING)(x.key), [mapType(x.value)[1]], mapType(x.value)[2](x.value)))(_data),
    LONG(_timestamp)
  )

  const computedFee = (Math.floor(1 + (bytes.length + 8/*feeLong*/ - 1) / 1024) * 100000)

  const tx: DataTransaction = {
    type: 12,
    version: 1,
    senderPublicKey,
    fee: computedFee,
    timestamp: _timestamp,
    proofs: [],
    id: '',
    ...paramsOrTx,
    data: _data && (_data as any).map((x: DataEntry | TypelessDataEntry) => {
      if ((<any>x).type) return x
      else {
        const type = mapType(x.value)[0]
        return {
          type,
          key: x.key,
          value: type === 'binary' ? 'base64:' + Buffer.from(x.value as any[]).toString('base64') : x.value as (string | number | boolean),
        }
      }
    }),
  }

  raiseValidationErrors(
    generalValidation(tx, validators.DataTransaction),
    dataValidation(tx)
  )
  bytes = dataToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? data(tx, nextSeed) : tx
} 