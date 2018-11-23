import { TRANSACTION_TYPE, ISetAssetScriptTransaction, ISetAssetScriptParams } from '../transactions'
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
import { SeedTypes } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export const setAssetScriptValidation = (tx: ISetAssetScriptTransaction): ValidationResult => [
  noError,
]

export const setAssetScriptToBytes = (tx: ISetAssetScriptTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.SET_ASSET_SCRIPT, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.fee),
  LONG(tx.timestamp),
  OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null)
)

/* @echo DOCS */
export function setAssetScript(paramsOrTx: ISetAssetScriptParams | ISetAssetScriptTransaction, seed?: SeedTypes): ISetAssetScriptTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: ISetAssetScriptTransaction = {
    type: TRANSACTION_TYPE.SET_ASSET_SCRIPT,
    version: 1,
    fee: 100000000,
    senderPublicKey,
    timestamp: Date.now(),
    chainId: 'W',
    proofs: [],
    id: '',
    ...paramsOrTx,
    script: base64Prefix(paramsOrTx.script),
  }

  raiseValidationErrors(
    generalValidation(tx, validators.ISetAssetScriptTransaction),
    setAssetScriptValidation(tx)
  )

  const bytes = setAssetScriptToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? setAssetScript(tx, nextSeed,) : tx
}
