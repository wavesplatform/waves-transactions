import { TransactionType, SetScriptTransaction, long } from '../transactions'
import {
  concat,
  BASE58_STRING,
  LONG,
  signBytes,
  hashBytes,
  BYTES,
  BASE64_STRING,
  OPTION,
  LEN,
  SHORT
} from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey, base64Prefix } from '../generic'
import { SeedTypes, Params } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export interface SetScriptParams extends Params {
  script: string | null
  fee?: long
  timestamp?: number
  chainId?: string
}

export const setScriptValidation = (tx: SetScriptTransaction): ValidationResult => [
  noError,
]

export const setScriptToBytes = (tx: SetScriptTransaction): Uint8Array => concat(
  BYTES([TransactionType.SetScript, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null),
  LONG(tx.fee),
  LONG(tx.timestamp)
)


/* @echo DOCS */
export function setScript(paramsOrTx: SetScriptParams | SetScriptTransaction, seed?: SeedTypes): SetScriptTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: SetScriptTransaction = {
    type: TransactionType.SetScript,
    version: 1,
    fee: 1000000,
    senderPublicKey,
    timestamp: Date.now(),
    chainId: 'W',
    proofs: [],
    id: '',
    ...paramsOrTx,
    script: base64Prefix(paramsOrTx.script),
  }

  raiseValidationErrors(
    generalValidation(tx, validators.SetScriptTransaction),
    setScriptValidation(tx)
  )

  const bytes = setScriptToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? setScript(tx, nextSeed,) : tx
}
