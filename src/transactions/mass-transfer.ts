import { TransactionType, MassTransferTransaction, Transfer } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION, empty, COUNT } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof, valOrDef, mapSeed, validateParams } from "../generic"

export interface MassTransferParams extends Params {
  transfers: Transfer[]
  attachment?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function massTransfer(seed: SeedTypes, paramsOrTx: MassTransferParams | MassTransferTransaction): MassTransferTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { assetId, transfers, attachment, fee, timestamp, senderPublicKey } = paramsOrTx

  validateParams(seed, paramsOrTx)

  const proofs = paramsOrTx['proofs']
  const tx: MassTransferTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as MassTransferTransaction : {
      type: TransactionType.MassTransfer,
      version: 1,
      transfers,
      attachment,
      assetId,
      fee: valOrDef(fee, (100000 + Math.ceil(0.5 * transfers.length) * 100000)),
      senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
      timestamp: valOrDef(timestamp, Date.now()),
      proofs: [],
      id: '' //TODO: invalid id for masstransfer tx
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

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? massTransfer(nextSeed, tx) : tx
}