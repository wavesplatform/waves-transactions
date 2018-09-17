import { TransactionType, ReissueTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"

export interface ReissueParams {
  assetId: string
  quantity: number
  reissuable: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function reissue(seed: string | string[], paramsOrTx: ReissueParams | ReissueTransaction): ReissueTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { assetId, quantity, chainId, reissuable, fee, timestamp } = paramsOrTx

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
      senderPublicKey: publicKey(_seed),
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

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return reissue(rest, tx)
  }

  return tx
}