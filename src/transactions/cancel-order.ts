import { concat, BASE58_STRING, OPTION, BYTE, LONG, signBytes, hashBytes } from 'waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, isOrder } from '../generic'
import { IOrder, IOrderParams, WithId, WithSender, ICancelOrderParams, ICancelOrder } from '../transactions'

export const cancelOrderParamsToBytes = (cancelOrderParams: ICancelOrderParams & WithSender) => concat(
  BASE58_STRING(cancelOrderParams.senderPublicKey),
  BASE58_STRING(cancelOrderParams.orderId),
)

export function cancelOrder(params: ICancelOrderParams, seed: string): ICancelOrder {
  const t = Date.now();

  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, params);

  const cancelOrderBody: ICancelOrder = {
    senderPublicKey,
    sender: senderPublicKey,
    orderId: params.orderId,
    timestamp: t,
    signature: signBytes(
      concat(BASE58_STRING(senderPublicKey), BASE58_STRING(params.orderId)),
      seed
    ),
  };

  return cancelOrderBody
}


