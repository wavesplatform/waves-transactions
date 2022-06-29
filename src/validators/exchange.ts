import {TRANSACTION_TYPE} from '@waves/ts-types'
import { orderValidator } from './order'
import {
    isEq,
    orEq,
    isNumber,
    isNumberLike,
    isArray,
    getError,
    validateByShema,
    ifElse, defaultValue, isPublicKey, validatePipe, isRequired, isNaturalNumberOrZeroLike
} from './validators'


const exchangeScheme = {
    type: isEq(TRANSACTION_TYPE.EXCHANGE),
    senderPublicKey: isPublicKey,
    version: orEq([undefined, 1, 2, 3]),
    order1: validatePipe(
        isRequired(true),
        orderValidator
    ),
    order2: validatePipe(
        isRequired(true),
        orderValidator
    ),
    amount: isNumberLike,
    price: isNumberLike,
    buyMatcherFee: isNumberLike,
    sellMatcherFee: isNumberLike,
    fee: isNaturalNumberOrZeroLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const exchangeValidator = validateByShema(exchangeScheme, getError)
