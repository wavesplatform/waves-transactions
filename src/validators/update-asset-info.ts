import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  defaultValue,
  getError,
  ifElse,
  isArray,
  isAssetId,
  isEq,
  isNaturalNumberOrZeroLike,
  isNumber,
  isPublicKey,
  isValidAssetDescription,
  isValidAssetName,
  orEq,
  validateByShema
} from './validators'


const updateAssetInfoScheme = {
  type: isEq(TRANSACTION_TYPE.UPDATE_ASSET_INFO),
  senderPublicKey: isPublicKey,
  name: isValidAssetName,
  description: isValidAssetDescription,
  version: orEq([1]),
  assetId: isAssetId,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
};


export const updateAssetInfoValidator = validateByShema(updateAssetInfoScheme, getError);
