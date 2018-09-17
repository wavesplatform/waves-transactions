import { TransactionType, MassTransferTransaction, Transfer } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION, empty, COUNT } from "waves-crypto"

export interface MassTransferParams {
  transfers: Transfer[]
  attachment?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
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