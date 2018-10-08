import { TransactionType, LeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof, valOrDef, mapSeed } from "../generic"

export interface LeaseParams extends Params {
  recipient: string
  amount: number
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function lease(seed: SeedTypes, paramsOrTx: LeaseParams | LeaseTransaction): LeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { recipient, amount, fee, timestamp, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: LeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as LeaseTransaction : {
      type: TransactionType.Lease,
      version: 2,
      recipient,
      amount,
      fee: valOrDef(fee, 100000),
      senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
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
  return nextSeed ? lease(nextSeed, tx) : tx
}