import { TransactionType, SetAssetScriptTransaction } from '../transactions'
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
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export interface SetAssetScriptParams extends Params {
  script: string | null
  assetId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

export const setAssetScriptValidation = (tx: SetAssetScriptTransaction): ValidationResult => [
  noError,
]

export const setAssetScriptToBytes = (tx: SetAssetScriptTransaction): Uint8Array => concat(
  BYTES([TransactionType.SetAssetScript, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.fee),
  LONG(tx.timestamp),
  OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null)
)

const base64Prefix = (str: string | null) => str === null || str.slice(0,7) === 'base64:' ? str : 'base64:' + str
/* @echo DOCS */
export function setAssetScript(paramsOrTx: SetAssetScriptParams | SetAssetScriptTransaction, seed?: SeedTypes): SetAssetScriptTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: SetAssetScriptTransaction = {
    type: TransactionType.SetAssetScript,
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
    generalValidation(tx, validators.SetAssetScriptTransaction),
    setAssetScriptValidation(tx)
  )

  const bytes = setAssetScriptToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? setAssetScript(tx, nextSeed,) : tx
}
