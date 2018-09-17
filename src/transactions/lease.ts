import { TransactionType, LeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"

export interface LeaseParams {
  recipient: string
  amount: number
  fee?: number
  timestamp?: number
}

/**
 * Creates and signs [[LeaseTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[LeaseTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { lease } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   amount: 100,
 *   recipient: '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs',
 *   //timestamp: Date.now(),
 *   //fee: 100000,
 * }
 * 
 * const signedLeaseTx = lease(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "9KrMhtm4G55sbErYmsRPiKp9arxxYaohHuhkZUzxxsEx",
 *   "type": 8,
 *   "version": 2,
 *   "recipient": "3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs",
 *   "amount": 100,
 *   "fee": 100000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537176019229,
 *   "proofs": [
 *     "2heCbAezodUBukQgZE4TWEWbXm5rW33u8br3Th7CE3oDarjGZPQbHLPqmY7oUM2Gms6XXvbkuvoiD4dV7bGxku6A"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function lease(seed: string | string[], paramsOrTx: LeaseParams | LeaseTransaction): LeaseTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { recipient, amount, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: LeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as LeaseTransaction : {
      type: TransactionType.Lease,
      version: 2,
      recipient,
      amount,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Lease, tx.version, 0]),
    BASE58_STRING(tx.senderPublicKey),
    BASE58_STRING(tx.recipient),
    LONG(tx.amount),
    LONG(tx.fee),
    LONG(tx.timestamp),
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return lease(rest, tx)
  }

  return tx
}