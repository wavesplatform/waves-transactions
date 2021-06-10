import {TRANSACTION_TYPE} from '@waves/ts-types'
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
    isPublicKey
} from './validators'

const burnScheme = {
    type: isEq(TRANSACTION_TYPE.BURN),
    senderPublicKey: isPublicKey,
    version: orEq([undefined, 2, 3]),
    assetId: isAssetId,
    amount: isNumberLike,
    chainId: isNumber,
    fee: isNumberLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
 }

export const burnValidator = validateByShema(burnScheme, getError)
