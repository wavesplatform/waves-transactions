import { concat, BASE58_STRING, OPTION, BYTE, LONG, signBytes, publicKey, hashBytes } from "waves-crypto"
import { SeedTypes, mapSeed, valOrDef, Params, addProof, pullSeedAndIndex } from "../generic"
import { Order } from "../transactions"

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


/**
 * Creates and signs [[Order]].
 *
 * You can use this function with multiple seeds. In this case it will sign order accordingly and will add one proof per seed.
 * Also you can use already signed [[Order]] as a second agrument.
 *
 * ### Usage
 * ```js
 * const { order } = require('waves-transactions')
 *
 * const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'
 *
 * const params = {
 *   amount: 100000000, //1 waves
 *   price: 10, //for 0.00000010 BTC
 *   priceAsset: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
 *   matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
 *   orderType: 'buy'
 * }
 * 
 *
 * const signedOrder = burn(seed, params)
 * ```
 * ### Output
 * ```json
 * {
 *   "id": "47YGqHdHtNPjcjE69E9EX9aD9bpC8PRKr4kp5AcZKHFq",
 *   "orderType": "buy",
 *   "assetPair": {
 *     "priceAsset": "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
 *   },
 *   "price": 10,
 *   "amount": 100000000,
 *   "timestamp": 1540898977249,
 *   "expiration": 1542626977249,
 *   "matcherFee": 300000,
 *   "matcherPublicKey": "7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy",
 *   "senderPublicKey": "G62H1XE5rnaCgCCURV5pWwQHzWezZB7VkkVgqthdKgkj",
 *   "proofs": [
 *     "4MbaDLkx9ezV1DrcGRfXRfnMBtYLaeLYBe6YGqkkuq1Pe6U9Qc5Cv7Fy1zYyGatbg47U5j374iAQFbLLZiYBChgU"
 *   ]
 * }
 * ```
 *
 * @param seed
 * @param paramsOrOrder
 * @returns
 *
 */
export function order(seed: SeedTypes, paramsOrOrder: OrderParams | Order): Order {
  const isOrder = (p: OrderParams | Order): p is Order => (<Order>p).assetPair !== undefined

  const amountAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.amountAsset : paramsOrOrder.amountAsset
  const priceAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.priceAsset : paramsOrOrder.priceAsset

  const { senderPublicKey, matcherFee, matcherPublicKey, price, amount, orderType, expiration, timestamp } = paramsOrOrder
  const t = valOrDef(timestamp, Date.now())

  //validateParams(seed, paramsOrOrder)

  const { nextSeed } = pullSeedAndIndex(seed)

  const ord: Order = {
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
    proofs: [],
    id: ''
  }

  const bytes = concat(
    BASE58_STRING(ord.senderPublicKey),
    BASE58_STRING(ord.matcherPublicKey),
    OPTION(BASE58_STRING)(ord.assetPair.amountAsset),
    OPTION(BASE58_STRING)(ord.assetPair.priceAsset),
    BYTE(ord.orderType == 'sell' ? 1 : 0),
    LONG(ord.price),
    LONG(ord.amount),
    LONG(ord.timestamp),
    LONG(ord.expiration),
    LONG(ord.matcherFee),
  )

  mapSeed(seed, s => addProof(ord, signBytes(bytes, s)))
  ord.id = hashBytes(bytes)

  return nextSeed ? order(nextSeed, ord) : ord
}


