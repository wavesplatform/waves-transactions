import {
    isEq,
    orEq,
    isAssetId,
    isRecipient,
    isNumber,
    isNumberLike,
    isAttachment,
    isArray,
    getError,
    validateByShema,
    ifElse, defaultValue, isPublicKey
} from './validators'
import {TRANSACTION_TYPE} from '@waves/ts-types'


const transferScheme = {
    type: isEq(TRANSACTION_TYPE.TRANSFER),
    senderPublicKey: isPublicKey,
    version: orEq([undefined, 2, 3]),
    assetId: isAssetId,
    feeAssetId: isAssetId,
    recipient: isRecipient,
    amount: isNumberLike,
    attachment: isAttachment,
    fee: isNumberLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
 }


export const transferValidator = validateByShema(transferScheme, getError)
