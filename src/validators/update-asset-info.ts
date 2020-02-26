import { TRANSACTION_TYPE } from '../transactions'
import {
    isEq,
    orEq,
    isNumber,
    isNumberLike,
    isArray,
    getError,
    validateByShema,
    ifElse,
    defaultValue,
    isAssetId,
    isPublicKey,
    isBase64, isString
} from './validators';

const setUpdateAssetInfoScheme = {
    type: isEq(TRANSACTION_TYPE.UPDATE_ASSET_INFO),
    senderPublicKey: isPublicKey,
    timestamp: isNumber,
    fee: isNumberLike,
    assetId: isAssetId,
    name: isString,
    description: isString,
    version: orEq([undefined, 0, 1]),
    chainId: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const updateAssetInfoValidator = validateByShema(setUpdateAssetInfoScheme, getError)
