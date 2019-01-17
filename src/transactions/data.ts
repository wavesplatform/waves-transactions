import {serializePrimitives} from '@waves/marshall'
const {
  BASE58_STRING,
  BASE64_STRING,
  BYTE,
  BYTES,
  COUNT,
  LEN,
  LONG,
  SHORT,
  STRING,
} = serializePrimitives
import { concat, hashBytes, signBytes } from '@waves/waves-crypto'
import {
  IDataTransaction,
  TRANSACTION_TYPE,
  DataEntry,
  DATA_FIELD_TYPE,
  IDataParams,
  WithId,
  WithSender
} from '../transactions'
import { addProof, convertToPairs, fee, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'

export interface TypelessDataEntry {
  key: string
  value: string | number | boolean | Buffer | Uint8Array | number[]
}



const typeMap: any = {
  integer: ['integer', 0, LONG],
  number: ['integer', 0, LONG],
  boolean: ['boolean', 1, BYTE],
  string: ['string', 3, LEN(SHORT)(STRING)],
  binary: ['binary', 2, (s:string) => LEN(SHORT)(BASE64_STRING)(s.slice(7))], // Slice base64: part
  _: ['binary', 2, LEN(SHORT)(BYTES)],
}

const mapType = <T>(value: T): [DATA_FIELD_TYPE, number, (value:T)=>Uint8Array] =>
  typeMap[typeof value] || typeMap['_']


/* @echo DOCS */
export function data(params: IDataParams, seed: TSeedTypes): IDataTransaction & WithId
export function data(paramsOrTx: IDataParams & WithSender | IDataTransaction, seed?: TSeedTypes): IDataTransaction & WithId
export function data(paramsOrTx: any, seed?: TSeedTypes): IDataTransaction & WithId  {
  const type = TRANSACTION_TYPE.DATA
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  if (! Array.isArray(paramsOrTx.data)) throw new Error('["data should be array"]')

  const _timestamp = paramsOrTx.timestamp || Date.now()

  let bytes = concat(
    BYTE(TRANSACTION_TYPE.DATA),
    BYTE(1),
    BASE58_STRING(senderPublicKey),
    COUNT(SHORT)((x: DataEntry | TypelessDataEntry) => concat(LEN(SHORT)(STRING)(x.key), [mapType(x.value)[1]], mapType(x.value)[2](x.value)))(paramsOrTx.data),
    LONG(_timestamp)
  )

  const computedFee = (Math.floor(1 + (bytes.length + 8/*feeLong*/ - 1) / 1024) * 100000)

  const tx: IDataTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    fee: fee(paramsOrTx, computedFee),
    timestamp: _timestamp,
    proofs: paramsOrTx.proofs || [],
    id: '',
    data: paramsOrTx.data && (paramsOrTx.data as any).map((x: DataEntry | TypelessDataEntry) => {
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
  const bytes1 = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes1, s),i))
  tx.id = hashBytes(bytes1)

  return tx
} 