import { TransactionType, SetScriptTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BASE64_STRING, OPTION, LEN, SHORT } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof, valOrDef, mapSeed, validateParams } from "../generic"

export interface SetScriptParams extends Params {
  script?: string //base64
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function setScript(seed: SeedTypes, paramsOrTx: SetScriptParams | SetScriptTransaction): SetScriptTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)
  const { script, fee, timestamp, chainId, senderPublicKey } = paramsOrTx

  validateParams(seed, paramsOrTx)
  if (script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const proofs = paramsOrTx['proofs']
  const tx: SetScriptTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as SetScriptTransaction : {
      type: TransactionType.SetScript,
      version: 1,
      script: script ? 'base64:' + script : null,
      fee: valOrDef(fee, 1000000),
      senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
      timestamp: valOrDef(timestamp, Date.now()),
      chainId: chainId || 'W',
      proofs: [],
      id: ''
    }

  const bytes = concat(
    BYTES([TransactionType.SetScript, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null),
    LONG(tx.fee),
    LONG(tx.timestamp),
  )

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? setScript(nextSeed, tx) : tx
}
