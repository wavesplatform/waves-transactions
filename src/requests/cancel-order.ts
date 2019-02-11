import { concat, signBytes } from '@waves/waves-crypto'
import { serializePrimitives } from '@waves/marshall'
const {BASE58_STRING} = serializePrimitives
import { getSenderPublicKey, convertToPairs } from '../generic'
import { WithSender, ICancelOrderParams, ICancelOrder } from '../transactions'

export const cancelOrderParamsToBytes = (cancelOrderParams: ICancelOrderParams & WithSender) => concat(
  BASE58_STRING(cancelOrderParams.senderPublicKey),
  BASE58_STRING(cancelOrderParams.orderId)
)

export function cancelOrder(params: ICancelOrderParams, seed: string): ICancelOrder {
  const t = Date.now()

  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, params)

  const cancelOrderBody: ICancelOrder = {
    sender: senderPublicKey,
    orderId: params.orderId,
    signature: signBytes(
      concat(BASE58_STRING(senderPublicKey), BASE58_STRING(params.orderId)),
      seed
    ),
  }

  return cancelOrderBody
}


