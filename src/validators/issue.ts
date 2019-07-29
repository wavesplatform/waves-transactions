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
  isValidAssetName,
  isValidAssetDescription,
  isBoolean, isBase64, isRequired
} from './validators'

const issueScheme = {
  type: isEq(TRANSACTION_TYPE.ISSUE),
  version: orEq([undefined, 2]),
  senderPublicKey: isPublicKey,
  name: isValidAssetName,
  description: isValidAssetDescription,
  quantity: isNumberLike,
  decimals: isNumber,
  reissuable: isBoolean,
  script: ifElse(
      isRequired(true),
      isBase64,
      defaultValue(true),
  ),
  chainId: isNumber,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const issueValidator = validateByShema(issueScheme, getError)
