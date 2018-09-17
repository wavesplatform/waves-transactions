import { TransactionType, TransferTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from "waves-crypto"

export interface TransferParams {
  recipient: string
  amount: number
  attachment?: string
  feeAssetId?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

/**
 * Creates and signs [[TransferTransaction]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[TransferTransaction]] as a second agrument.
 * 
 * ### Usage
 * ```js
 * const { transfer } = require('waves-transactions')
 * 
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 * 
 * //Transfering 100 WAVES
 * const params = {
 *   amount: 100,
 *   recipient: '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs',
 *   //feeAssetId: undefined
 *   //assetId: undefined
 *   //attachment: undefined
 *   //timestamp: Date.now(),
 *   //fee: 100000,
 * }
 * 
 * const signedTransferTx = transfer(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "DKrTsnpDGevgv6CnDJCJ149uJAdEBPQnWzVPX6AjTNch",
 *   "type": 4,
 *   "version": 2,
 *   "recipient": "3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs",
 *   "amount": 100,
 *   "fee": 100000,
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "timestamp": 1537177250555,
 *   "proofs": [
 *     "2NkdseiK13AaTGHYctdfwWwV9wynKg8DFTwAFA5JwtD761hUBAJSpVBSYuvwermXuZ3tHgfHxsd7YM9vVfPsNPNC"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */
export function transfer(seed: string | string[], paramsOrTx: TransferParams | TransferTransaction): TransferTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { recipient, assetId, amount, feeAssetId, attachment, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: TransferTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as TransferTransaction : {
      type: TransactionType.Transfer,
      version: 2,
      recipient,
      attachment,
      feeAssetId,
      assetId,
      amount,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTE(TransactionType.Transfer),
    BYTE(tx.version),
    BASE58_STRING(tx.senderPublicKey),
    OPTION(BASE58_STRING)(tx.assetId),
    OPTION(BASE58_STRING)(tx.feeAssetId),
    LONG(tx.timestamp),
    LONG(tx.amount),
    LONG(tx.fee),
    BASE58_STRING(tx.recipient),
    LEN(SHORT)(STRING)(tx.attachment),
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return transfer(rest, tx)
  }

  return tx
}