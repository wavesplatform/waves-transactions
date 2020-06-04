/**
 * @module index
 */
import {
  TRANSACTION_TYPE,
  WithId,
  WithSender,
  IUpdateAssetInfoParams, IUpdateAssetInfoTransaction
} from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, normalizeAssetId, networkByte } from '../generic'
import { validate } from '../validators'
import { TSeedTypes } from '../types'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions';

/* @echo DOCS */
export function updateAssetInfo(params: IUpdateAssetInfoParams, seed: TSeedTypes): IUpdateAssetInfoTransaction & WithId
export function updateAssetInfo(paramsOrTx: IUpdateAssetInfoParams & WithSender | IUpdateAssetInfoTransaction, seed?: TSeedTypes): IUpdateAssetInfoTransaction & WithId
export function updateAssetInfo(paramsOrTx: any, seed?: TSeedTypes): IUpdateAssetInfoTransaction & WithId {
  const type = TRANSACTION_TYPE.UPDATE_ASSET_INFO
  const version = paramsOrTx.version || DEFAULT_VERSIONS.UPDATE_ASSET_INFO
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IUpdateAssetInfoTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    name: paramsOrTx.name,
    description: paramsOrTx.description,
    assetId: paramsOrTx.assetId,
    fee: fee(paramsOrTx, 100000),
    feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    chainId: networkByte(paramsOrTx.chainId, 87),
    id: '',
  }

  validate.updateAssetInfo(tx)

  const bytes = txToProtoBytes(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
