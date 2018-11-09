import { TransactionType, CancelLeaseTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { pullSeedAndIndex, addProof, valOrDef, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";

export interface CancelLeaseParams extends Params {
  leaseId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function cancelLease(paramsOrTx: CancelLeaseParams | CancelLeaseTransaction, seed?: SeedTypes): CancelLeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { leaseId, fee, timestamp, chainId: chain } = paramsOrTx
  const cId = chain || 'W'
  const chainId = typeof cId === 'string' ? cId : String(cId)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const proofs = (<any>paramsOrTx)['proofs']
  const tx: CancelLeaseTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as CancelLeaseTransaction : {
      type: TransactionType.CancelLease,
      version: 2,
      leaseId,
      fee: valOrDef(fee, 100000),
      senderPublicKey,
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
  return nextSeed ? cancelLease(tx, nextSeed) : tx
}