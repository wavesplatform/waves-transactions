import {TRANSACTION_TYPE} from '@waves/ts-types'

import {
    defaultValue,
    getError,
    ifElse,
    isArray,
    isBase58,
    isEq,
    isNaturalNumberOrZeroLike,
    isNumber,
    isPublicKey,
    orEq,
    validateByShema,
} from './validators'

const commitToGeneractionScheme = {
    type: isEq(TRANSACTION_TYPE.COMMIT_TO_GENERATION),
    senderPublicKey: isPublicKey,
    version: orEq([1]),
    generationPeriodStart: isNumber,
    endorserPublicKey: isBase58,
    commitmentSignature: isBase58,
    fee: isNaturalNumberOrZeroLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([undefined])),
}

export const commitToGeneractionValidator = validateByShema(commitToGeneractionScheme, getError)
