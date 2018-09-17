import { TransactionType, BurnTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"

export interface BurnParams {
  assetId: string
  quantity: number
  fee?: number
  timestamp?: number
  chainId?: string
}

/**
 * Creates and signs [[BurnTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[BurnTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { burn } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   assetId: '4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC',
 *   quantity: 100,
 *   //timestamp: Date.now(),
 *   //fee: 100000,
 *   //chainId: 'W',
 * }
 * 
 * const signedBurnTx = burn(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "HF3Ca5J55hURUfdJ95SyFvR7bQ1nQJPtMLaYtD2RbGq2",
 *   "type": 6,
 *   "version": 2,
 *   "assetId": "4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC",
 *   "quantity": 100,
 *   "chainId": "W",
 *   "fee": 100000000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537176019163,
 *   "proofs": [
 *     "4kpYiTDHKJLMwMFu3ZcDfDoCMtysd5vsuf88oJqrcXrSz4ouWscQa6JeJ6sf5a8oU9auXncp5FbaZHT3gZww3ZYN"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function burn(seed: string | string[], paramsOrTx: BurnParams | BurnTransaction): BurnTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { assetId, quantity, chainId, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: BurnTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as BurnTransaction : {
      type: TransactionType.Burn,
      version: 2,
      assetId,
      quantity,
      chainId: chainId || 'W',
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Burn, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    BASE58_STRING(tx.assetId),
    LONG(tx.quantity),
    LONG(tx.fee),
    LONG(tx.timestamp)
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return burn(rest, tx)
  }

  return tx
}
