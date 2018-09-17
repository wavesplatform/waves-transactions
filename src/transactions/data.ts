import { publicKey, LEN, LONG, BYTE, SHORT, BYTES, STRING, concat, BASE58_STRING, COUNT, signBytes, hashBytes } from "waves-crypto"
import { DataTransaction, TransactionType } from "../transactions"

export interface DataEntry {
  key: string
  value: string | number | boolean | Buffer | Uint8Array | number[]
}

export interface DataParams {
  data: DataEntry[]
  fee?: number,
  timestamp?: number
}

/**
 * Creates and signs [[DataTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[DataTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { data } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   data: [
 *     { key: 'integerVal', value: 1 },
 *     { key: 'booleanVal', value: true },
 *     { key: 'stringVal', value: 'hello' },
 *     { key: 'binaryVal', value: [1, 2, 3, 4] },
 *   ]
 *   //timestamp: Date.now(),
 *   //fee: 100000 + bytes.length * 100000
 * }
 * 
 * const signedDataTx = data(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "E35imFdb9igi9bk2YexYbDuK7y84hgbDLMKkG3c9HmVY",
 *   "type": 12,
 *   "version": 1,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "fee": 100000,
 *   "timestamp": 1537176019199,
 *   "data": [
 *     {
 *       "type": "integer",
 *       "key": "integerVal",
 *       "value": 1
 *     },
 *     {
 *       "type": "boolean",
 *       "key": "booleanVal",
 *       "value": true
 *     },
 *     {
 *       "type": "string",
 *       "key": "stringVal",
 *       "value": "hello"
 *     },
 *     {
 *       "type": "binary",
 *       "key": "binaryVal",
 *       "value": "base64:AQIDBA=="
 *     }
 *   ],
 *   "proofs": [
 *     "nrjBkBJLB8ehRVaTHH4QF6jqF3PBm3Ke9vKkJtLNsEJtMveoejfEoERLRkroBfqNdy5zsvxczzkFYuJGYhXTuza"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function data(seed: string | string[], paramsOrTx: DataParams | DataTransaction): DataTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { data: _data, fee, timestamp } = paramsOrTx

  const typeMap = {
    number: ['integer', 0, LONG],
    boolean: ['boolean', 1, BYTE],
    string: ['string', 3, LEN(SHORT)(STRING)],
    _: ['binary', 2, LEN(SHORT)(BYTES)],
  }

  const mapType = (value) => typeMap[typeof value] || typeMap['_']

  const senderPublicKey = publicKey(_seed)
  const _timestamp = timestamp || Date.now()

  let bytes = concat(
    BYTE(TransactionType.Data),
    BYTE(1),
    BASE58_STRING(senderPublicKey),
    COUNT(SHORT)((x: DataEntry) => concat(LEN(SHORT)(STRING)(x.key), [mapType(x.value)[1]], mapType(x.value)[2](x.value)))(_data),
    LONG(_timestamp)
  )

  const computedFee = (Math.floor(1 + (bytes.length + 8/*feeLong*/ - 1) / 1024) * 100000)

  const _fee = fee || computedFee

  const proofs = paramsOrTx['proofs']
  const tx: DataTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as DataTransaction : {
      type: 12,
      version: 1,
      senderPublicKey,
      fee: _fee,
      timestamp: _timestamp,
      data: (_data as Array<DataEntry>).map(x => {
        const type = mapType(x.value)[0]
        const v = {
          type,
          key: x.key,
          value: type == 'binary' ? 'base64:' + Buffer.from(x.value as any[]).toString('base64') : x.value as (string | number | boolean)
        }
        return v
      }),
      proofs: [],
      id: ''
    }

  bytes = concat(bytes, LONG(tx.fee))

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return data(rest, tx)
  }

  return tx
} 