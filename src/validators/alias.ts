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


const aliasScheme = {
    type: isEq(TRANSACTION_TYPE.ALIAS),
    version: orEq([undefined, 0, 1, 2]),
    alias: isValidAliasName,
    fee: isNumberLike,
    timestamp: isNumber,
    proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
 };


export const aliasValidator = validateByShema(aliasScheme, getError)
