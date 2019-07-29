import { TRANSACTION_TYPE } from '../transactions'
import {
  isEq,
  orEq,
  isRecipient,
  isNumber,
  isNumberLike,
  isArray,
  getError,
  validateByShema,
  ifElse, defaultValue, isPublicKey
} from './validators'


const leaseScheme = {
  type: isEq(TRANSACTION_TYPE.LEASE),
  version: orEq([undefined, 2]),
  senderPublicKey: isPublicKey,
  recipient: isRecipient,
  amount: isNumberLike,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const leaseValidator = validateByShema(leaseScheme, getError)
