import { TransactionType, CancelLeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"

export interface CancelLeaseParams {
  leaseId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function cancelLease(seed: string | string[], paramsOrTx: CancelLeaseParams | CancelLeaseTransaction): CancelLeaseTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { leaseId, fee, timestamp, chainId: chain } = paramsOrTx
  const cId = chain || 'W'
  const chainId = typeof cId == 'string' ? cId : new String(cId)

  const proofs = paramsOrTx['proofs']
  const tx: CancelLeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as CancelLeaseTransaction : {
      type: TransactionType.CancelLease,
      version: 2,
      leaseId,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      chainId: (chainId || 'W').charCodeAt(0),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.CancelLease, tx.version, tx.chainId]),
    BASE58_STRING(tx.senderPublicKey),
    LONG(tx.fee),
    LONG(tx.timestamp),
    BASE58_STRING(tx.leaseId)
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return cancelLease(rest, tx)
  }

  return tx
}