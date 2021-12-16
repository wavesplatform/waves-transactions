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
  isPublicKey,
  isBase64, isNaturalNumberOrZeroLike
} from './validators'

const setAssetScriptScheme = {
  type: isEq(TRANSACTION_TYPE.SET_ASSET_SCRIPT),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1, 2]),
  assetId: isAssetId,
  chainId: isNumber,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  script: isBase64,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const setAssetScriptValidator = validateByShema(setAssetScriptScheme, getError)
