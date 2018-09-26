import { TransactionType, LeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof, valOrDef } from "../generic"

export interface LeaseParams extends Params {
  recipient: string
  amount: number
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function lease(seed: SeedTypes, paramsOrTx: LeaseParams | LeaseTransaction): LeaseTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { recipient, amount, fee, timestamp, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: LeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as LeaseTransaction : {
      type: TransactionType.Lease,
      version: 2,
      recipient,
      amount,
      fee: valOrDef(fee, 100000),
      senderPublicKey: senderPublicKey || publicKey(_seed),
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

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? lease(newSeed, tx) : tx
}