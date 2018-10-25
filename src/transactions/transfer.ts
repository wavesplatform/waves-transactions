import { TransactionType, TransferTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof, valOrDef, mapSeed, validateParams } from "../generic"

export interface TransferParams extends Params {
  recipient: string
  amount: number
  attachment?: string
  feeAssetId?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function transfer(seed: SeedTypes, paramsOrTx: TransferParams | TransferTransaction): TransferTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { recipient, assetId, amount, feeAssetId, attachment, fee, timestamp, senderPublicKey } = paramsOrTx

  validateParams(seed, paramsOrTx)

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
      fee: valOrDef(fee, 100000),
      senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
      timestamp: valOrDef(timestamp, Date.now()),
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

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? transfer(nextSeed, tx) : tx
}