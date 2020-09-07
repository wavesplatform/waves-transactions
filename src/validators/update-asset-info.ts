import { TRANSACTION_TYPE } from '../transactions'
import {
  isEq,
  orEq,
  isAssetId,
  isRecipient,
  isNumber,
  isNumberLike,
  isAttachment,
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
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};


export const updateAssetInfoValidator = validateByShema(updateAssetInfoScheme, getError)
