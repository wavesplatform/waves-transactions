import { TransactionType, CancelLeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof } from "../generic"

export interface CancelLeaseParams extends Params {
  leaseId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function cancelLease(seed: SeedTypes, paramsOrTx: CancelLeaseParams | CancelLeaseTransaction): CancelLeaseTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { leaseId, fee, timestamp, chainId: chain, senderPublicKey } = paramsOrTx
  const cId = chain || 'W'
  const chainId = typeof cId == 'string' ? cId : new String(cId)

  const proofs = paramsOrTx['proofs']
  const tx: CancelLeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as CancelLeaseTransaction : {
      type: TransactionType.CancelLease,
      version: 2,
      leaseId,
      fee: fee | 100000,
      senderPublicKey: senderPublicKey || publicKey(_seed),
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

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? cancelLease(newSeed, tx) : tx
}