import { TRANSACTION_TYPE, ISetScriptTransaction, ISetScriptParams, WithId } from '../transactions'
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



export const setScriptValidation = (tx: ISetScriptTransaction): ValidationResult => [
  noError,
]

export const setScriptToBytes = (tx: ISetScriptTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.SET_SCRIPT, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null),
  LONG(tx.fee),
  LONG(tx.timestamp)
)


/* @echo DOCS */
export function setScript(paramsOrTx: ISetScriptParams | ISetScriptTransaction, seed?: TSeedTypes): ISetScriptTransaction & WithId {
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: ISetScriptTransaction & WithId = {
    type: TRANSACTION_TYPE.SET_SCRIPT,
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

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}
