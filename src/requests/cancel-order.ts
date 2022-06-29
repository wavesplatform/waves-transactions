/**
 * @module index
 */
import { base58Encode, blake2b, concat, signBytes } from '@waves/ts-lib-crypto'
import { serializePrimitives } from '@waves/marshall'
const {BASE58_STRING} = serializePrimitives
import { getSenderPublicKey, convertToPairs } from '../generic'
import { ICancelOrderParams, ICancelOrder } from '../transactions'
import { validate } from '../validators'
import { TPrivateKey } from '../types'

export const cancelOrderParamsToBytes = (cancelOrderParams:{sender: string, orderId: string}) => concat(
    BASE58_STRING(cancelOrderParams.sender),
    BASE58_STRING(cancelOrderParams.orderId)
)

export function cancelOrder(params: ICancelOrderParams, seed?: string | TPrivateKey): ICancelOrder {

  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = params.senderPublicKey || getSenderPublicKey(seedsAndIndexes, {senderPublicKey: undefined})
  const bytes = concat(BASE58_STRING(senderPublicKey), BASE58_STRING(params.orderId))
  const signature = params.signature || ( seed != null && signBytes(seed, bytes)) || ''
  const hash =  base58Encode(blake2b(Uint8Array.from(bytes)))

  const cancelOrderBody: ICancelOrder = {
    sender: senderPublicKey,
    orderId: params.orderId,
    signature,
    hash,
  }

  validate.cancelOrder(cancelOrderBody)

  return cancelOrderBody
}


