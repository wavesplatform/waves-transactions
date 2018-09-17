import { TransactionType, BurnTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"

export interface BurnParams {
  assetId: string
  quantity: number
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function burn(seed: string | string[], paramsOrTx: BurnParams | BurnTransaction): BurnTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { assetId, quantity, chainId, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: BurnTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as BurnTransaction : {
      type: TransactionType.Burn,
      version: 2,
      assetId,
      quantity,
      chainId: chainId || 'W',
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
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

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return burn(rest, tx)
  }

  return tx
}
