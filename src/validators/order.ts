import {
  isEq,
  orEq,
  isAssetId,
  isNumber,
  isNumberLike,
  isArray,
  getError,
  validateByShema,
  ifElse,
  isPublicKey,
  validatePipe,
  pipe,
  prop,
  defaultValue,
  isRequired
} from './validators'


const orderScheme = {
  orderType: orEq(['sell', 'buy']),
  senderPublicKey: isPublicKey,
  matcherPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1, 2, 3]),
  assetPair: validatePipe(
      isRequired(true),
      pipe(prop('amountAsset'), isAssetId),
      pipe(prop('priceAsset'), isAssetId),
  ),
  price: isNumberLike,
  amount: isNumberLike,
  matcherFee: isNumberLike,
  expiration: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};

const v1_2_OrderScheme = {
  matcherFeeAssetId: orEq([undefined, null, 'WAVES'])
}

const v3_OrderScheme = {
  matcherFeeAssetId: isAssetId
}

const validateOrder = validateByShema(orderScheme, getError)
const validateOrderV2 = validateByShema(v1_2_OrderScheme, getError)
const validateOrderV3 = validateByShema(v3_OrderScheme, getError)

export const orderValidator = validatePipe(
    validateOrder,
    ifElse(
        pipe(prop('version'), isEq(3)),
        validateOrderV3,
        validateOrderV2
    )
)
