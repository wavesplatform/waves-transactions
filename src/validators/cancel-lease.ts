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
  isAssetId,
  isPublicKey
} from './validators'

const cancelLeaseScheme = {
  type: isEq(TRANSACTION_TYPE.CANCEL_LEASE),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 2]),
  leaseId: isAssetId,
  chainId: isNumber,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const cancelLeaseValidator = validateByShema(cancelLeaseScheme, getError)
