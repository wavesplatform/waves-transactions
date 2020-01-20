/**
 * @module index
 */
import { ISetAssetScriptParams, WithSender } from '../transactions'
import { base58Encode, blake2b, signBytes, } from '@waves/ts-lib-crypto'
import {
    TBase64Script,
    TRANSACTION_TYPE,
    TSetAssetScriptTransaction,
    TSetAssetScriptTransactionWithId
} from '@waves/ts-types'
import { addProof, base64Prefix, convertToPairs, fee, getSenderPublicKey, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'


/* @echo DOCS */
export function setAssetScript(params: ISetAssetScriptParams, seed: TSeedTypes): TSetAssetScriptTransactionWithId
export function setAssetScript(paramsOrTx: ISetAssetScriptParams & WithSender | TSetAssetScriptTransaction, seed?: TSeedTypes): TSetAssetScriptTransactionWithId
export function setAssetScript(paramsOrTx: ISetAssetScriptParams | ISetAssetScriptParams & WithSender | TSetAssetScriptTransaction, seed?: TSeedTypes): TSetAssetScriptTransactionWithId {
    const type = TRANSACTION_TYPE.SET_ASSET_SCRIPT
    const version = 'version' in paramsOrTx && paramsOrTx.version != null ? paramsOrTx.version : 2;
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
    if (paramsOrTx.script == null) throw new Error('Asset script cannot be empty')

    const tx: TSetAssetScriptTransactionWithId = {
        type,
        version: (paramsOrTx as any).version || 2,
        senderPublicKey,
        assetId: paramsOrTx.assetId,
        chainId: networkByte(paramsOrTx.chainId, 87),
        fee: fee(paramsOrTx, 100000000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        proofs: 'proofs' in paramsOrTx && paramsOrTx.proofs != null ? paramsOrTx.proofs : [],
        id: '',
        script: (base64Prefix(paramsOrTx.script) as string),
    }

    validate.setAssetScript(tx)

    const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
    tx.id = base58Encode(blake2b(bytes))

    return tx
}
