import { TransactionType, SetScriptTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BASE64_STRING, OPTION } from "waves-crypto"

export interface SetScriptParams {
  script?: string //base64
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function setScript(seed: string | string[], paramsOrTx: SetScriptParams | SetScriptTransaction): SetScriptTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { script, fee, timestamp, chainId } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: SetScriptTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as SetScriptTransaction : {
      type: TransactionType.SetScript,
      version: 2,
      script,
      fee: fee | 100000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      chainId: chainId || 'W',
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.SetScript, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    OPTION(BASE64_STRING)(tx.script),
    LONG(tx.fee),
    LONG(tx.timestamp),
  )

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return setScript(rest, tx)
  }

  return tx
}