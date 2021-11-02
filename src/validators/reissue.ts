import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  isEq,
  orEq,
  isNumber,
  isArray,
  getError,
  validateByShema,
  ifElse,
  defaultValue,
  isAssetId,
  isPublicKey, isBoolean,
  isNaturalNumber
} from './validators'

const reissueScheme = {
  type: isEq(TRANSACTION_TYPE.REISSUE),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 2, 3]),
  assetId: isAssetId,
  quantity: isNaturalNumber,
  reissuable: isBoolean,
  chainId: isNumber,
  fee: isNaturalNumber,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const reissueValidator = validateByShema(reissueScheme, getError)
