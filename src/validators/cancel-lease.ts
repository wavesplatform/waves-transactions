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
  isAssetId,
  isPublicKey, isNaturalNumberOrZeroLike
} from './validators'

const cancelLeaseScheme = {
  type: isEq(TRANSACTION_TYPE.CANCEL_LEASE),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 2, 3]),
  leaseId: isAssetId,
  chainId: isNumber,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const cancelLeaseValidator = validateByShema(cancelLeaseScheme, getError)
