import {
  isEq,
  orEq,
  isWavesOrAssetId,
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
  version: orEq([undefined, 1, 2, 3, 4]),
  assetPair: validatePipe(
      isRequired(true),
      pipe(prop('amountAsset'), isWavesOrAssetId),
      pipe(prop('priceAsset'), isWavesOrAssetId)
  ),
  price: isNumberLike,
  amount: isNumberLike,
  matcherFee: isNumberLike,
  expiration: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

const v1_2_OrderScheme = {
  matcherFeeAssetId: orEq([undefined, null, 'WAVES']),
}

const v3_OrderScheme = {
  matcherFeeAssetId: isWavesOrAssetId,
}

const validateOrder = validateByShema(orderScheme, getError)
const validateOrderV2 = validateByShema(v1_2_OrderScheme, getError)
const validateOrderV3 = validateByShema(v3_OrderScheme, getError)

export const orderValidator = validatePipe(
    validateOrder,
    ifElse(
        pipe(prop('version'), (v: number) => v >= 3),
        validateOrderV3,
        validateOrderV2
    )
)
