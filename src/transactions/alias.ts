import { TransactionType, AliasTransaction } from "../transactions"
import { concat, BASE58_STRING, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { addProof, pullSeedAndIndex, valOrDef, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";

export interface AliasParams extends Params {
  alias: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function alias(paramsOrTx: AliasParams | AliasTransaction, seed?: SeedTypes): AliasTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { alias: _alias, fee, timestamp } = paramsOrTx

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const proofs = (<any>paramsOrTx)['proofs']
  const tx: AliasTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as AliasTransaction : {
      type: TransactionType.Alias,
      version: 2,
      alias: _alias,
      fee: valOrDef(fee, 100000),
      senderPublicKey,
      timestamp: valOrDef(timestamp, Date.now()),
      id: '',
      proofs: []
    }


  const bytes = concat(
    BYTES([TransactionType.Alias, tx.version]),
    BASE58_STRING(tx.senderPublicKey),
    LEN(SHORT)(STRING)(tx.alias),
    LONG(tx.fee),
    LONG(tx.timestamp)
  )

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? alias(tx, nextSeed,) : tx
}