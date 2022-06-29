import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
    defaultValue,
    getError,
    ifElse,
    isArray,
    isAssetId,
    isEq,
    isNaturalNumberLike,
    isNaturalNumberOrZeroLike,
    isNumber,
    isPublicKey,
    orEq,
    validateByShema
} from './validators'

const burnScheme = {
    type: isEq(TRANSACTION_TYPE.BURN),
    senderPublicKey: isPublicKey,
    version: orEq([undefined, 2, 3]),
    assetId: isAssetId,
    amount: isNaturalNumberLike,
    chainId: isNaturalNumberLike,
    fee: isNaturalNumberOrZeroLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
 };

export const burnValidator = validateByShema(burnScheme, getError);
