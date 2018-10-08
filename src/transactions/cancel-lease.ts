import { TransactionType, CancelLeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof, valOrDef, mapSeed } from "../generic"

export interface CancelLeaseParams extends Params {
  leaseId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function cancelLease(seed: SeedTypes, paramsOrTx: CancelLeaseParams | CancelLeaseTransaction): CancelLeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { leaseId, fee, timestamp, chainId: chain, senderPublicKey } = paramsOrTx
  const cId = chain || 'W'
  const chainId = typeof cId == 'string' ? cId : new String(cId)

  const proofs = paramsOrTx['proofs']
  const tx: CancelLeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as CancelLeaseTransaction : {
      type: TransactionType.CancelLease,
      version: 2,
      leaseId,
      fee: valOrDef(fee, 100000),
      senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
      timestamp: valOrDef(timestamp, Date.now()),
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

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? cancelLease(nextSeed, tx) : tx
}