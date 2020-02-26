/**
 * @module index
 */
import {
    IUpdateAssetInfoParams,
    IUpdateAssetInfoTransaction,
    TRANSACTION_TYPE,
    WithId,
    WithSender
} from '../transactions';
import { base58Encode, base64Encode, blake2b, signBytes, } from '@waves/ts-lib-crypto';
import { addProof, convertToPairs, fee, getSenderPublicKey, networkByte } from '../generic';
import { TSeedTypes } from '../types';
import { binary } from '@waves/marshall';
import { validate } from '../validators';


/* @echo DOCS */
export function updateAssetInfo(params: IUpdateAssetInfoParams, seed: TSeedTypes): IUpdateAssetInfoTransaction & WithId
export function updateAssetInfo(paramsOrTx: IUpdateAssetInfoParams & WithSender | IUpdateAssetInfoTransaction, seed?: TSeedTypes): IUpdateAssetInfoTransaction & WithId
export function updateAssetInfo(paramsOrTx: any, seed?: TSeedTypes): IUpdateAssetInfoTransaction & WithId {
    const type = TRANSACTION_TYPE.UPDATE_ASSET_INFO;
    const version = paramsOrTx.version || 1;
    const seedsAndIndexes = convertToPairs(seed);
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    const tx: IUpdateAssetInfoTransaction & WithId = {
        type,
        version,
        senderPublicKey,
        assetId: paramsOrTx.assetId,
        chainId: networkByte(paramsOrTx.chainId, 87),
        fee: fee(paramsOrTx, 100000000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        proofs: paramsOrTx.proofs || [],
        id: '',
        name:  paramsOrTx.name,
        description:  paramsOrTx.description,
        feeAssetId:  paramsOrTx.feeAssetId || null ,
    };
    validate.updateAssetInfo(tx);

    const bytes = binary.serializeTx(tx);
    console.log(base64Encode(bytes))
    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i));
    tx.id = base58Encode(blake2b(bytes));

    return tx;
}
