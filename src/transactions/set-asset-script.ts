import { TRANSACTION_TYPE, ISetAssetScriptTransaction, ISetAssetScriptParams, WithId } from '../transactions'
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
import { addProof, getSenderPublicKey, base64Prefix, convertToPairs } from '../generic'
import { TSeedTypes } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/src'

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
export function setAssetScript(paramsOrTx: ISetAssetScriptParams | ISetAssetScriptTransaction, seed?: TSeedTypes): ISetAssetScriptTransaction & WithId{
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: ISetAssetScriptTransaction & WithId = {
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


  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}
