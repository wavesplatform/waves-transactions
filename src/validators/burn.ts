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
    isValidAliasName,
    defaultValue
} from './validators'


const burnScheme = {
    type: isEq(TRANSACTION_TYPE.ALIAS),
    version: orEq([undefined, 0, 1, 2]),
    burn: isValidAliasName,
    fee: isNumberLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
 };


export const burnValidator = validateByShema(burnScheme, getError)
