// /**
//  * @module index
//  */
// import {IInvokeExpressionParams, WithId, WithProofs, WithSender} from '../transactions'
// import {base58Encode, blake2b, signBytes,} from '@waves/ts-lib-crypto'
// import {
//     addProof,
//     base64Prefix,
//     convertToPairs,
//     fee,
//     getSenderPublicKey,
//     networkByte,
//     normalizeAssetId
// } from '../generic'
// import {TSeedTypes} from '../types'
// import {validate} from '../validators'
// import {txToProtoBytes} from '../proto-serialize'
// import {DEFAULT_VERSIONS} from '../defaultVersions'
// import {InvokeExpressionTransaction, TRANSACTION_TYPE} from '@waves/ts-types'
//
// /* @echo DOCS */
// export function invokeExpression(params: IInvokeExpressionParams, seed: TSeedTypes): InvokeExpressionTransaction & WithId & WithProofs
// export function invokeExpression(paramsOrTx: IInvokeExpressionParams & WithSender | InvokeExpressionTransaction, seed?: TSeedTypes): InvokeExpressionTransaction & WithId & WithProofs
// export function invokeExpression(paramsOrTx: any, seed?: TSeedTypes): InvokeExpressionTransaction & WithId & WithProofs{
//     const type = TRANSACTION_TYPE.INVOKE_EXPRESSION
//     const version = paramsOrTx.version || DEFAULT_VERSIONS.INVOKE_EXPRESSION
//     const seedsAndIndexes = convertToPairs(seed)
//     const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
//
//     const tx: InvokeExpressionTransaction & WithId & WithProofs = {
//         type,
//         version,
//         senderPublicKey,
//         expression: base64Prefix(paramsOrTx.expression),
//         fee: fee(paramsOrTx, 1000000),
//         feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
//         timestamp: paramsOrTx.timestamp || Date.now(),
//         chainId: networkByte(paramsOrTx.chainId, 87),
//         proofs: paramsOrTx.proofs || [],
//         id: '',
//     }
//
//     validate.invokeExpression(tx)
//     const bytes = txToProtoBytes(tx)
//
//     seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
//     tx.id = base58Encode(base58Encode(blake2b(bytes)))
//
//     return tx
// }
