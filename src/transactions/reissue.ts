import { TransactionType, ReissueTransaction } from "../transactions"
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"
import { pullSeedAndIndex, addProof, valOrDef, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";

export interface ReissueParams extends Params {
  assetId: string
  quantity: number
  reissuable: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function reissue(paramsOrTx: ReissueParams | ReissueTransaction, seed?: SeedTypes): ReissueTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { assetId, quantity, chainId, reissuable, fee, timestamp } = paramsOrTx

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const proofs = (<any>paramsOrTx)['proofs']
  const tx: ReissueTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as ReissueTransaction : {
      type: TransactionType.Reissue,
      version: 2,
      assetId,
      quantity,
      chainId: chainId || 'W',
      reissuable,
      fee: valOrDef(fee, 100000000),
      senderPublicKey,
      timestamp: valOrDef(timestamp, Date.now()),
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

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? reissue(tx, nextSeed) : tx
}