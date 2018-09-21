import { TransactionType, MassTransferTransaction, Transfer } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION, empty, COUNT } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof } from "../generic"

export interface MassTransferParams extends Params {
  transfers: Transfer[]
  attachment?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function massTransfer(seed: SeedTypes, paramsOrTx: MassTransferParams | MassTransferTransaction): MassTransferTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { assetId, transfers, attachment, fee, timestamp, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: MassTransferTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as MassTransferTransaction : {
      type: TransactionType.MassTransfer,
      version: 1,
      transfers,
      attachment,
      assetId,
      fee: fee | (100000 + Math.ceil(0.5 * transfers.length) * 100000),
      senderPublicKey: senderPublicKey || publicKey(_seed),
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

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? massTransfer(newSeed, tx) : tx
}