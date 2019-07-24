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
  ifElse,
  defaultValue,
  isPublicKey,
  validatePipe,
  pipe,
  prop,
  gte,
  isRequired
} from './validators'


const massTransferScheme = {
  type: isEq(TRANSACTION_TYPE.MASS_TRANSFER),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 0, 1]),
  transfers: validatePipe(
      isArray,
      pipe(prop('length'), gte(0)),
      (data: Array<unknown>) => data.every(
          validatePipe(
              isRequired(true),
              pipe(prop('recipient'), isRecipient),
              pipe(prop('amount'), isNumberLike),
          )
      )
  ),
  assetId: isAssetId,
  attachment: isAttachment,
  fee: isNumberLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ]))
};


export const massTransferValidator = validateByShema(massTransferScheme, getError)
