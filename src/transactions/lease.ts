import { TransactionType, LeaseTransaction } from "../transactions"
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { pullSeedAndIndex, addProof, valOrDef, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";

export interface LeaseParams extends Params {
  recipient: string
  amount: number
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function lease(paramsOrTx: LeaseParams | LeaseTransaction, seed?: SeedTypes): LeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { recipient, amount, fee, timestamp } = paramsOrTx

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const proofs = (<any>paramsOrTx)['proofs']
  const tx: LeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as LeaseTransaction : {
      type: TransactionType.Lease,
      version: 2,
      recipient,
      amount,
      fee: valOrDef(fee, 100000),
      senderPublicKey,
      timestamp: valOrDef(timestamp, Date.now()),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Lease, tx.version, 0]),
    BASE58_STRING(tx.senderPublicKey),
    BASE58_STRING(tx.recipient),
    LONG(tx.amount),
    LONG(tx.fee),
    LONG(tx.timestamp),
  )

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? lease(tx, nextSeed) : tx
}