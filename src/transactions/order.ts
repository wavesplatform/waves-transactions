import { concat, BASE58_STRING, OPTION, BYTE, LONG, signBytes, publicKey } from "waves-crypto"
import { SeedTypes, mapSeed, valOrDef, Params, validateParams } from "../generic"

export interface OrderParams extends Params {
  matcherPublicKey: string
  price: number
  amount: number
  orderType: 'buy' | 'sell',
  amountAsset?: string
  priceAsset?: string
  senderPublicKey?: string
  matcherFee?: number
  timestamp?: number
  expiration?: number
}

/* @echo DOCS */
export function order(seed: SeedTypes, params: OrderParams) {
  const { senderPublicKey, matcherFee, matcherPublicKey, amountAsset, priceAsset, price, amount, orderType, expiration, timestamp } = params
  const t = valOrDef(timestamp, Date.now())

  validateParams(seed, params)

  const order = {
    orderType,
    assetPair: {
      amountAsset,
      priceAsset,
    },
    price,
    amount,
    timestamp: t,
    expiration: valOrDef(expiration, t + 1728000000),
    matcherFee: valOrDef(matcherFee, 300000),
    matcherPublicKey,
    senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
    signature: ''
  }

  mapSeed(seed, s => {
    const bytes = concat(
      BASE58_STRING(order.senderPublicKey),
      BASE58_STRING(order.matcherPublicKey),
      OPTION(BASE58_STRING)(order.assetPair.amountAsset),
      OPTION(BASE58_STRING)(order.assetPair.priceAsset),
      BYTE(order.orderType == 'sell' ? 1 : 0),
      LONG(order.price),
      LONG(order.amount),
      LONG(order.timestamp),
      LONG(order.expiration),
      LONG(order.matcherFee),
    )
    order.signature = signBytes(bytes, s)

    order.assetPair.amountAsset = order.assetPair.amountAsset || ''
    order.assetPair.priceAsset = order.assetPair.priceAsset || ''
  })

  return order
}


