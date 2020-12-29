import { TRANSACTION_TYPE } from '../transactions'
import {
  isEq,
  orEq,
  isAssetId,
  isRecipient,
  isNumber,
  isNumberLike,
  prop,
  isArray,
  getError,
  validateByShema,
  ifElse,
  defaultValue,
  isPublicKey,
  isRequired,
  validatePipe,
  pipe,
  isString,
  gte,
  isValidDataPair
} from './validators'


const invokeScheme = {
  type: isEq(TRANSACTION_TYPE.INVOKE_SCRIPT),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1, 2, 3]),
  dApp: isRecipient,

  call: ifElse(
      isRequired(false),
      defaultValue(true),
      validatePipe(
          pipe(prop('function'), isString),
          pipe(prop('function'), prop('length'), gte(0)),
          pipe(prop('args'), isArray),
          (data: Array<unknown>) => data.every(
              validatePipe(
                  isRequired(true),
                  isValidDataPair
              )
          ),
      )
  ),
  payment: validatePipe(
      isArray,
      (data: Array<unknown>) => data.every(
          validatePipe(
              pipe(prop('amount'), isNumberLike),
              pipe(prop('assetId'), isAssetId),
          )
      )
  ),
  fee: isNumberLike,
  feeAssetId: isAssetId,
  chainId: isNumber,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
}

const invokeV3Scheme = {
  ...invokeScheme,
  extraFeePerStep: isNumberLike,
}

export const invokeValidator = validateByShema(invokeScheme, getError)
export const invokeV3Validator = validateByShema(invokeV3Scheme, getError)
