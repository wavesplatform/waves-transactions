import {
    defaultValue,
    getError,
    ifElse,
    isArray,
    isAttachment,
    isEq,
    isNaturalNumberOrZeroLike,
    isPublicKey,
    isRecipient,
    isWavesOrAssetId,
    orEq,
    validateByShema
} from './validators'
import {TRANSACTION_TYPE} from '@waves/ts-types'


const transferScheme = {
    type: isEq(TRANSACTION_TYPE.TRANSFER),
    senderPublicKey: isPublicKey,
    version: orEq([undefined, 2, 3]),
    assetId: isWavesOrAssetId,
    feeAssetId: isWavesOrAssetId,
    recipient: isRecipient,
    amount: isNaturalNumberOrZeroLike,
    attachment: isAttachment,
    fee: isNaturalNumberOrZeroLike,
    timestamp: isNaturalNumberOrZeroLike,
    proofs: ifElse(isArray, defaultValue(true), orEq([undefined])),
}


export const transferValidator = validateByShema(transferScheme, getError)
