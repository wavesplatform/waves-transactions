import { TransactionType, LeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"

export interface LeaseParams {
  recipient: string
  amount: number
  fee?: number
  timestamp?: number
}

/* @echo DOCS */
export function lease(seed: string | string[], paramsOrTx: LeaseParams | LeaseTransaction): LeaseTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { recipient, amount, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: LeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as LeaseTransaction : {
      type: TransactionType.Lease,
      version: 2,
      recipient,
      amount,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
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

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return lease(rest, tx)
  }

  return tx
}