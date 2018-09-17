import { TransactionType, ReissueTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"

export interface ReissueParams {
  assetId: string
  quantity: number
  reissuable: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

/**
 * Creates and signs [[ReissueTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[ReissueTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { reissue } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   quantity: 10000,
 *   assetId: '3toqCSpAHShatE75UFKxqymuWFr8nxuxD7UcLjdxVFLx',
 *   reissuable: false,
 *   //timestamp: Date.now(),
 *   //fee: 100000000,
 *   //chainId: 'W'
 * }
 * 
 * const signedReissueTx = reissue(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "Ha6jftgUWQJUd8skC1yoVjVf1Y8eN7asrBQMhUstTHNF",
 *   "type": 5,
 *   "version": 2,
 *   "assetId": "3toqCSpAHShatE75UFKxqymuWFr8nxuxD7UcLjdxVFLx",
 *   "quantity": 10000,
 *   "chainId": "W",
 *   "reissuable": false,
 *   "fee": 100000000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537176019270,
 *   "proofs": [
 *     "4SwRP6huyvi2WN6rMrMJa3tyHDC8dA5z8A6mVra8Fg6mRckRx6b5cxe1VguAFUieUwYw8Da9L6WGE7EfTkA58oiG"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function reissue(seed: string | string[], paramsOrTx: ReissueParams | ReissueTransaction): ReissueTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { assetId, quantity, chainId, reissuable, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: ReissueTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as ReissueTransaction : {
      type: TransactionType.Reissue,
      version: 2,
      assetId,
      quantity,
      chainId: chainId || 'W',
      reissuable,
      fee: fee | 100000000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Reissue, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    BASE58_STRING(tx.assetId),
    LONG(tx.quantity),
    BOOL(tx.reissuable),
    LONG(tx.fee),
    LONG(tx.timestamp)
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return reissue(rest, tx)
  }

  return tx
}