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
  isPublicKey, isBoolean
} from './validators'

const reissueScheme = {
  type: isEq(TRANSACTION_TYPE.REISSUE),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 2]),
  assetId: isAssetId,
  quantity: isNumberLike,
  reissuable: isBoolean,
  chainId: isNumber,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const reissueValidator = validateByShema(reissueScheme, getError)
