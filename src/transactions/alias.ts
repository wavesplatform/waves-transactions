import { TransactionType, AliasTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { Params, addProof, pullSeedAndIndex, SeedTypes, valOrDef } from "../generic"

export interface AliasParams extends Params {
  alias: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function alias(seed: SeedTypes, paramsOrTx: AliasParams | AliasTransaction): AliasTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { alias: _alias, fee, timestamp, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: AliasTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as AliasTransaction : {
      type: TransactionType.Alias,
      version: 2,
      alias: _alias,
      fee: valOrDef(fee, 100000),
      senderPublicKey: senderPublicKey || publicKey(_seed),
      timestamp: valOrDef(timestamp, Date.now()),
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.Alias, tx.version]),
    BASE58_STRING(tx.senderPublicKey),
    LEN(SHORT)(STRING)(tx.alias),
    LONG(tx.fee),
    LONG(tx.timestamp)
  )

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? alias(newSeed, tx) : tx
}