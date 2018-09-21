import { TransactionType, SetScriptTransaction } from "../transactions"
import { publicKey, concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BASE64_STRING, OPTION } from "waves-crypto"
import { Params, pullSeedAndIndex, SeedTypes, addProof } from "../generic"

export interface SetScriptParams extends Params {
  script?: string //base64
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function setScript(seed: SeedTypes, paramsOrTx: SetScriptParams | SetScriptTransaction): SetScriptTransaction {
  const { seed: _seed, index, newSeed } = pullSeedAndIndex(seed)
  const { script, fee, timestamp, chainId, senderPublicKey } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: SetScriptTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as SetScriptTransaction : {
      type: TransactionType.SetScript,
      version: 1,
      script: 'base64:' + script,
      fee: fee | 100000,
      senderPublicKey: senderPublicKey || publicKey(_seed),
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

  addProof(tx, signBytes(bytes, _seed), index)
  tx.id = hashBytes(bytes)
  return newSeed ? setScript(newSeed, tx) : tx
}
