import { TransactionType, AliasTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"

export interface AliasParams {
  alias: string
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function alias(seed: string | string[], paramsOrTx: AliasParams | AliasTransaction): AliasTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { alias: _alias, fee, timestamp } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: AliasTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as AliasTransaction : {
      type: TransactionType.Alias,
      version: 2,
      alias: _alias,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
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

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return alias(rest, tx)
  }

  return tx
}