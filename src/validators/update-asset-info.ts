import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  isEq,
  orEq,
  isAssetId,
  isNumber,
  isNumberLike,
  isArray,
  getError,
  validateByShema,
  ifElse, defaultValue, isPublicKey, isValidAssetName, isValidAssetDescription
} from './validators'


const updateAssetInfoScheme = {
  type: isEq(TRANSACTION_TYPE.UPDATE_ASSET_INFO),
  senderPublicKey: isPublicKey,
  name: isValidAssetName,
  description: isValidAssetDescription,
  version: orEq([1]),
  assetId: isAssetId,
  feeAssetId: isAssetId,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}


export const updateAssetInfoValidator = validateByShema(updateAssetInfoScheme, getError)
