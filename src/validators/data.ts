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
  isValidData,
} from './validators'



const dataScheme = {
  type: isEq(TRANSACTION_TYPE.DATA),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1]),
  data: (data: Array<unknown> ) =>
      isArray(data) &&
      data.every(item => isValidData(item)),
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const dataValidator = validateByShema(dataScheme, getError)
