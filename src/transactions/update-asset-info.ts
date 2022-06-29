/**
 * @module index
 */
import {IUpdateAssetInfoParams, WithId, WithProofs, WithSender} from '../transactions'
import {base58Encode, blake2b, signBytes} from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {validate} from '../validators'
import {TSeedTypes} from '../types'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {TRANSACTION_TYPE, UpdateAssetInfoTransaction} from '@waves/ts-types'

/* @echo DOCS */
export function updateAssetInfo(params: IUpdateAssetInfoParams, seed: TSeedTypes): UpdateAssetInfoTransaction & WithId & WithProofs
export function updateAssetInfo(paramsOrTx: IUpdateAssetInfoParams & WithSender | UpdateAssetInfoTransaction, seed?: TSeedTypes): UpdateAssetInfoTransaction & WithId & WithProofs
export function updateAssetInfo(paramsOrTx: any, seed?: TSeedTypes): UpdateAssetInfoTransaction & WithId & WithProofs {
    const type = TRANSACTION_TYPE.UPDATE_ASSET_INFO
    const version = paramsOrTx.version || DEFAULT_VERSIONS.UPDATE_ASSET_INFO
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    const tx: UpdateAssetInfoTransaction & WithId & WithProofs = {
        type,
        version,
        senderPublicKey,
        name: paramsOrTx.name,
        description: paramsOrTx.description,
        assetId: paramsOrTx.assetId,
        fee: fee(paramsOrTx, 100000),
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
