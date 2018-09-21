import { TransactionType, ReissueTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof } from "../generic"

export interface ReissueParams extends Params {
  assetId: string
  quantity: number
  reissuable: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function reissue(seed: SeedTypes, paramsOrTx: ReissueParams | ReissueTransaction): ReissueTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { assetId, quantity, chainId, reissuable, fee, timestamp, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: ReissueTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as ReissueTransaction : {
      type: TransactionType.Reissue,
      version: 2,
      assetId,
      quantity,
      chainId: chainId || 'W',
      reissuable,
      fee: fee | 100000000,
      senderPublicKey: senderPublicKey || publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Reissue, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    BASE58_STRING(tx.assetId),
    LONG(tx.quantity),
    BOOL(tx.reissuable),
    LONG(tx.fee),
    LONG(tx.timestamp)
  )

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? reissue(newSeed, tx) : tx
}