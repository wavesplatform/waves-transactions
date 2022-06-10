import {TRANSACTION_TYPE} from '@waves/ts-types'
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
  isValidDeleteRequest, isNaturalNumberOrZeroLike,
} from './validators'



const dataScheme = {
  type: isEq(TRANSACTION_TYPE.DATA),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 1, 2]),
  data: (data: Array<unknown> ) =>
      isArray(data) &&
      data.every(item => isValidData(item) || isValidDeleteRequest(item)),
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const dataFieldValidator = (item: unknown ) => isValidData(item) || isValidDeleteRequest(item)

export const dataValidator = validateByShema(dataScheme, getError)
