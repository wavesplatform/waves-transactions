import { IssueTransaction, TransactionType } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"

export interface IssueParams {
  name: string
  description: string
  decimals?: number
  quantity: number
  reissuable?: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

/**
 * Creates and signs [[IssueTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[IssueTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { issue } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   name: 'SCAM TOKEN',
 *   description: 'Awesome token that will tokenize tokenization tokenized',
 *   quantity: 1000000,
 *   //reissuable: false
 *   //decimals: 8
 *   //timestamp: Date.now(),
 *   //fee: 100000,
 *   //chainId: 'W'
 * }
 * 
 * const signedIssueTx = issue(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "CTBXhJZLFDgky4EZj7LHKPWDx5BxdoYBZCQ92ppvSC7R",
 *   "type": 3,
 *   "version": 2,
 *   "name": "SCAM TOKEN",
 *   "description": "Awesome token that will tokenize tokenization tokenized",
 *   "decimals": 8,
 *   "quantity": 1000000,
 *   "reissuable": false,
 *   "fee": 100000000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537176019214,
 *   "chainId": "W",
 *   "proofs": [
 *     "64xxGNn2NEoKMpYxBkgmye9RcjeoJEMtKHZUZ4FffE4wtVjXj2ZbNTLEdN9LaC1WvCNRsRNwvDzrhfMUTgQYkwAX"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function issue(seed: string | string[], paramsOrTx: IssueParams | IssueTransaction): IssueTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { name, description, decimals, quantity, reissuable, fee, timestamp, chainId } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: IssueTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as IssueTransaction : {
      type: TransactionType.Issue,
      version: 2,
      name,
      description,
      decimals: decimals || 8,
      quantity,
      reissuable: reissuable || false,
      fee: fee | 100000000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      chainId: chainId || 'W',
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Issue, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    LEN(SHORT)(STRING)(tx.name),
    LEN(SHORT)(STRING)(tx.description),
    LONG(tx.quantity),
    BYTE(tx.decimals),
    BOOL(tx.reissuable),
    LONG(tx.fee),
    LONG(tx.timestamp),
    [0] //Script
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return issue(rest, tx)
  }

  return tx
}