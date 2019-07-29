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

const sponsorshipScheme = {
  type: isEq(TRANSACTION_TYPE.SPONSORSHIP),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1]),
  assetId: isAssetId,
  minSponsoredAssetFee: isNumberLike,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

export const sponsorshipValidator = validateByShema(sponsorshipScheme, getError)
