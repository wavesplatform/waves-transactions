// import {TRANSACTION_TYPE} from '@waves/ts-types'
// import {
//     isEq,
//     orEq,
//     isWavesOrAssetId,
//     isNumber,
//     isNumberLike,
//     isArray,
//     getError,
//     validateByShema,
//     ifElse,
//     defaultValue,
//     isPublicKey,
//     isBase64, isNaturalNumberOrZeroLike
// } from './validators'
//
//
// const invokeScheme = {
//     type: isEq(TRANSACTION_TYPE.INVOKE_EXPRESSION),
//     senderPublicKey: isPublicKey,
//     version: isEq(1),
//     expression: isBase64,
//     fee: isNaturalNumberOrZeroLike,
//     feeAssetId: isWavesOrAssetId,
//     chainId: isNumber,
//     timestamp: isNumber,
//     proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
// }
//
//
// export const invokeExpressionValidator = validateByShema(invokeScheme, getError)
