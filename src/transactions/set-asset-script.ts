/**
 * @module index
 */
import {
  ISetAssetScriptParams,
  WithId, WithProofs,
  WithSender
} from '../transactions'
import { signBytes, blake2b, base58Encode, } from '@waves/ts-lib-crypto'
import {
  addProof,
  getSenderPublicKey,
  base64Prefix,
  convertToPairs,
  networkByte,
  fee,
} from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions'
import {SetAssetScriptTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function setAssetScript(params: ISetAssetScriptParams, seed: TSeedTypes): SetAssetScriptTransaction & WithId & WithProofs
export function setAssetScript(paramsOrTx: ISetAssetScriptParams & WithSender | SetAssetScriptTransaction, seed?: TSeedTypes): SetAssetScriptTransaction & WithId & WithProofs
export function setAssetScript(paramsOrTx: any, seed?: TSeedTypes): SetAssetScriptTransaction & WithId & WithProofs{
  const type = TRANSACTION_TYPE.SET_ASSET_SCRIPT
  const version = paramsOrTx.version || DEFAULT_VERSIONS.SET_ASSET_SCRIPT
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  if (paramsOrTx.script == null) throw new Error('Asset script cannot be empty')

  const tx: SetAssetScriptTransaction & WithId & WithProofs = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
    script: base64Prefix(paramsOrTx.script) || '',
  }

  validate.setAssetScript(tx)

  const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
