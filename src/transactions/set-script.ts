/**
 * @module index
 */
import {ISetScriptParams, WithId, WithProofs, WithSender} from '../transactions'
import { signBytes, blake2b, base58Encode, } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, base64Prefix, convertToPairs, networkByte, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions'
import {SetScriptTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function setScript(params: ISetScriptParams, seed: TSeedTypes): SetScriptTransaction & WithId
export function setScript(paramsOrTx: ISetScriptParams & WithSender | SetScriptTransaction, seed?: TSeedTypes): SetScriptTransaction & WithId
export function setScript(paramsOrTx: any, seed?: TSeedTypes): SetScriptTransaction & WithId {
  const type = TRANSACTION_TYPE.SET_SCRIPT
  const version = paramsOrTx.version || DEFAULT_VERSIONS.SET_SCRIPT
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: SetScriptTransaction & WithId & WithProofs= {
    type,
    version,
    senderPublicKey,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx, 1000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
    script: base64Prefix(paramsOrTx.script),
  }

  validate.setScript(tx)

  const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(s, bytes),i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
