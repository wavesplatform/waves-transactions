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

/* @echo DOCS */
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