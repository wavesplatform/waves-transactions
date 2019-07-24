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
  defaultValue,
  isPublicKey,
  isBase64
} from './validators'

const setScriptScheme = {
  type: isEq(TRANSACTION_TYPE.SET_SCRIPT),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1]),
  chainId: isNumber,
  fee: isNumberLike,
  timestamp: isNumber,
  script: ifElse(isEq(null), defaultValue(true), isBase64),
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const setScriptValidator = validateByShema(setScriptScheme, getError)
