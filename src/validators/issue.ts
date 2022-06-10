import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  defaultValue,
  getError,
  ifElse,
  isArray,
  isBase64,
  isBoolean,
  isEq,
  isNaturalNumberLike,
  isNaturalNumberOrZeroLike,
  isNumber,
  isPublicKey,
  isRequired,
  isValidAssetDescription,
  isValidAssetName,
  orEq,
  validateByShema
} from './validators'

const issueScheme = {
  type: isEq(TRANSACTION_TYPE.ISSUE),
  version: orEq([undefined, 2, 3]),
  senderPublicKey: isPublicKey,
  name: isValidAssetName,
  description: isValidAssetDescription,
  quantity: isNaturalNumberLike,
  decimals: isNumber,
  reissuable: isBoolean,
  script: ifElse(
      isRequired(true),
      isBase64,
      defaultValue(true)
  ),
  chainId: isNumber,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
};

export const issueValidator = validateByShema(issueScheme, getError);
