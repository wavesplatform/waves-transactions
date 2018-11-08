import { TransactionType, TransferTransaction } from "../transactions"
import { concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from "waves-crypto"
import { pullSeedAndIndex, addProof, valOrDef, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";

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
export function transfer(paramsOrTx: TransferParams | TransferTransaction, seed?: SeedTypes): TransferTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { recipient, assetId, amount, feeAssetId, attachment, fee, timestamp } = paramsOrTx

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const proofs = (<any>paramsOrTx)['proofs']
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
      senderPublicKey,
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
  return nextSeed ? transfer(tx, nextSeed) : tx
}