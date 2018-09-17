import { TransactionType, CancelLeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"

export interface CancelLeaseParams {
  leaseId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/**
 * Creates and signs [[CancelLeaseTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[CancelLeaseTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { cancelLease } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   leaseId: '2fYhSNrXpyKgbtHzh5tnpvnQYuL7JpBFMBthPSGFrqqg',
 *   //timestamp: Date.now(),
 *   //fee: 100000,
 *   //chainId: 'W'
 * }
 * 
 * const signedCancelLeaseTx = cancelLease(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "EQBdvnUyu1hw7fXd7zP6dmLnUp3cQSzocf8sBQgj6wk",
 *   "type": 9,
 *   "version": 2,
 *   "leaseId": "2fYhSNrXpyKgbtHzh5tnpvnQYuL7JpBFMBthPSGFrqqg",
 *   "fee": 100000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537176837270,
 *   "chainId": 117,
 *   "proofs": [
 *     "w1FgYTASn8wzqqCX659dtnFEdp2vcVJposPkcNpKJ3FkEwu3jKQh2nRigRK3knZHkJDm5ABPnmrkLvhrWGZ6oYV"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function cancelLease(seed: string | string[], paramsOrTx: CancelLeaseParams | CancelLeaseTransaction): CancelLeaseTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { leaseId, fee, timestamp, chainId: chain } = paramsOrTx
  const cId = chain || 'W'
  const chainId = typeof cId == 'string' ? cId : new String(cId)

  const proofs = paramsOrTx['proofs']
  const tx: CancelLeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as CancelLeaseTransaction : {
      type: TransactionType.CancelLease,
      version: 2,
      leaseId,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      chainId: (chainId || 'W').charCodeAt(0),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.CancelLease, tx.version, tx.chainId]),
    BASE58_STRING(tx.senderPublicKey),
    LONG(tx.fee),
    LONG(tx.timestamp),
    BASE58_STRING(tx.leaseId)
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return cancelLease(rest, tx)
  }

  return tx
}