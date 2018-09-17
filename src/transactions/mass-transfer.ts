import { TransactionType, MassTransferTransaction, Transfer } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION, empty, COUNT } from "waves-crypto"

export interface MassTransferParams {
  transfers: Transfer[]
  attachment?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

/**
 * Creates and signs [[MassTransferTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[MassTransferTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { massTransfer } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * const params = {
 *   transfers: [
 *     {
 *       amount: 100,
 *       recipient: '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs',
 *     },
 *     {
 *       amount: 200,
 *       recipient: '3PPnqZznWJbPG2Z1Y35w8tZzskiq5AMfUXr',
 *     }
 *   ]
 *   //timestamp: Date.now(),
 *   //fee: 100000 + transfers.length * 50000,
 * }
 * 
 * const signedMassTransferTx = massTransfer(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "5WGyoTFG7hH2FBeRCnC1CEPGVnAZDSfP56C1MsajeBHP",
 *   "type": 11,
 *   "version": 1,
 *   "transfers": [
 *     {
 *       "amount": 100,
 *       "recipient": "3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs"
 *     },
 *     {
 *       "amount": 200,
 *       "recipient": "3PPnqZznWJbPG2Z1Y35w8tZzskiq5AMfUXr"
 *     }
 *   ],
 *   "fee": 200000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537176019240,
 *   "proofs": [
 *     "4SDkc7PW4hK4hQeeuToEgA34SG3LVxHrPKyuK877BxFsHHLdUhwCwMvzMp6y7J8X7QE6XSouR5KqvZkbvk4xwXBE"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function massTransfer(seed: string | string[], paramsOrTx: MassTransferParams | MassTransferTransaction): MassTransferTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { assetId, transfers, attachment, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: MassTransferTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as MassTransferTransaction : {
      type: TransactionType.MassTransfer,
      version: 1,
      transfers,
      attachment,
      assetId,
      fee: fee | (100000 + Math.ceil(0.5 * transfers.length) * 100000),
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTE(TransactionType.MassTransfer),
    BYTE(1),
    BASE58_STRING(tx.senderPublicKey),
    OPTION(BASE58_STRING)(tx.assetId),
    COUNT(SHORT)((x: Transfer) => concat(BASE58_STRING(x.recipient), LONG(x.amount)))(tx.transfers),
    LONG(tx.timestamp),
    LONG(tx.fee),
    LEN(SHORT)(STRING)(tx.attachment),
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return massTransfer(rest, tx)
  }

  return tx
}