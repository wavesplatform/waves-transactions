import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  defaultValue,
  getError,
  ifElse,
  isArray,
  isEq,
  isNaturalNumberLike,
  isNaturalNumberOrZeroLike,
  isNumber,
  isPublicKey,
  isRecipient,
  orEq,
  validateByShema
} from './validators'


const leaseScheme = {
  type: isEq(TRANSACTION_TYPE.LEASE),
  version: orEq([undefined, 2, 3]),
  senderPublicKey: isPublicKey,
  recipient: isRecipient,
  amount: isNaturalNumberLike,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
};

export const leaseValidator = validateByShema(leaseScheme, getError);
