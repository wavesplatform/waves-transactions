/**
 * @module index
 */
import { WithSender, IUpdateAssetInfoParams } from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { TUpdateAssetInfoTransaction, TRANSACTION_TYPE, TUpdateAssetInfoTransactionWithId} from '@waves/ts-types'
import { addProof, getSenderPublicKey, convertToPairs, fee, normalizeAssetId, networkByte } from '../generic'
import { validate } from '../validators'
import { TSeedTypes } from '../types'
import { txToProtoBytes } from '../proto-serialize'

/* @echo DOCS */
export function updateAssetInfo(params: IUpdateAssetInfoParams, seed: TSeedTypes): TUpdateAssetInfoTransactionWithId
export function updateAssetInfo(paramsOrTx: IUpdateAssetInfoParams & WithSender | TUpdateAssetInfoTransaction, seed?: TSeedTypes): TUpdateAssetInfoTransactionWithId
export function updateAssetInfo(paramsOrTx: any, seed?: TSeedTypes): TUpdateAssetInfoTransactionWithId {
  const type = TRANSACTION_TYPE.UPDATE_ASSET_INFO
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: TUpdateAssetInfoTransactionWithId = {
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
