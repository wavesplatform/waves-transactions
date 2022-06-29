import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
    isEq,
    orEq,
    isBoolean,
    isNumber,
    isArray,
    defaultValue,
    getError,
    ifElse,
    isAssetId,
    isNaturalNumber,
    isNaturalNumberLike,
    isNaturalNumberOrZeroLike,
    isPublicKey,
    validateByShema
} from './validators'

const reissueScheme = {
    type: isEq(TRANSACTION_TYPE.REISSUE),
    senderPublicKey: isPublicKey,
    version: orEq([undefined, 2, 3]),
    assetId: isAssetId,
    quantity: isNaturalNumberLike,
    reissuable: isBoolean,
    chainId: isNaturalNumberLike,
    fee: isNaturalNumberOrZeroLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([undefined])),
}

export const reissueValidator = validateByShema(reissueScheme, getError)
