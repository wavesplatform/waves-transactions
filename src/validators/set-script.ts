import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  defaultValue,
  getError,
  ifElse,
  isArray,
  isBase64,
  isEq,
  isNaturalNumberLike,
  isNaturalNumberOrZeroLike,
  isNumber,
  isPublicKey,
  orEq,
  validateByShema
} from './validators'

const setScriptScheme = {
  type: isEq(TRANSACTION_TYPE.SET_SCRIPT),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 1, 2]),
  chainId: isNaturalNumberLike,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  script: ifElse(isEq(null), defaultValue(true), isBase64),
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const setScriptValidator = validateByShema(setScriptScheme, getError);
