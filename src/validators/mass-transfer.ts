import {TRANSACTION_TYPE} from '@waves/ts-types'
import {
    defaultValue,
    getError,
    gte,
    ifElse,
    isArray,
    isAttachment,
    isEq,
    isNaturalNumberOrZeroLike,
    isNumber,
    isPublicKey,
    isRecipient,
    isRequired,
    isWavesOrAssetId, lte,
    orEq,
    pipe,
    prop,
    validateByShema,
    validatePipe
} from './validators'


const massTransferScheme = {
  type: isEq(TRANSACTION_TYPE.MASS_TRANSFER),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 1, 2]),
  transfers: validatePipe(
      isArray,
      pipe(prop('length'), gte(0)),
      pipe(prop('length'), lte(100)),
      (data: Array<unknown>) => data.every(
          validatePipe(
              isRequired(true),
              pipe(prop('recipient'), isRecipient),
              pipe(prop('amount'), isNaturalNumberOrZeroLike)
          )
      )
  ),
  assetId: isWavesOrAssetId,
  attachment: isAttachment,
  fee: isNaturalNumberOrZeroLike,
  timestamp: isNumber,
  proofs: ifElse(isArray, defaultValue(true), orEq([ undefined ])),
}

export const massTransferValidator = validateByShema(massTransferScheme, getError);
