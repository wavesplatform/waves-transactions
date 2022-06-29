import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
  defaultValue,
  getError,
  ifElse,
  isArray,
  isAssetId,
  isEq,
  isNaturalNumberOrNullLike,
  isNaturalNumberOrZeroLike,
  isNumber,
  isPublicKey,
  orEq,
  validateByShema
} from './validators'

const sponsorshipScheme = {
  type: isEq(TRANSACTION_TYPE.SPONSORSHIP),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 1, 2]),
  assetId: isAssetId,
  minSponsoredAssetFee: isNaturalNumberOrNullLike,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
};

export const sponsorshipValidator = validateByShema(sponsorshipScheme, getError);
