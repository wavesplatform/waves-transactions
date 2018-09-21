import { TransactionType, BurnTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { Params, pullSeedAndIndex, addProof, SeedTypes } from "../generic"

export interface BurnParams extends Params {
  assetId: string
  quantity: number
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function burn(seed: SeedTypes, paramsOrTx: BurnParams | BurnTransaction): BurnTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { assetId, quantity, chainId, fee, timestamp, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: BurnTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as BurnTransaction : {
      type: TransactionType.Burn,
      version: 2,
      assetId,
      quantity,
      chainId: chainId || 'W',
      fee: fee | 100000,
      senderPublicKey: senderPublicKey || publicKey(_seed),
      timestamp: timestamp || Date.now(),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Burn, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    BASE58_STRING(tx.assetId),
    LONG(tx.quantity),
    LONG(tx.fee),
    LONG(tx.timestamp)
  )

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? burn(newSeed, tx) : tx
}
