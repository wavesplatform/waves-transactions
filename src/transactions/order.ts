import { concat, BASE58_STRING, OPTION, BYTE, LONG, signBytes, hashBytes } from 'waves-crypto'
import { mapSeed, valOrDef, addProof, pullSeedAndIndex, getSenderPublicKey } from '../generic'
import { IOrder, IOrderParams } from '../transactions'
import { SeedTypes } from '../types'
import { ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'



export const isOrder = (p: any): p is IOrder => (<IOrder>p).assetPair !== undefined

export const orderValidation = (ord: IOrder): ValidationResult => []

export const orderToBytes = (ord: IOrder) => concat(
  BASE58_STRING(ord.senderPublicKey),
  BASE58_STRING(ord.matcherPublicKey),
  OPTION(BASE58_STRING)(ord.assetPair.amountAsset),
  OPTION(BASE58_STRING)(ord.assetPair.priceAsset),
  BYTE(ord.orderType === 'sell' ? 1 : 0),
  LONG(ord.price),
  LONG(ord.amount),
  LONG(ord.timestamp),
  LONG(ord.expiration),
  LONG(ord.matcherFee)
)

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
 * const signedOrder = order(params, seed)
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
 * @param paramsOrOrder
 * @param [seed]
 * @returns
 *
 */
export function order(paramsOrOrder: IOrderParams | IOrder, seed?: SeedTypes): IOrder {

  const amountAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.amountAsset : paramsOrOrder.amountAsset
  const priceAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.priceAsset : paramsOrOrder.priceAsset
  const proofs = isOrder(paramsOrOrder) ? paramsOrOrder.proofs : []

  const { matcherFee, matcherPublicKey, price, amount, orderType, expiration, timestamp } = paramsOrOrder
  const t = valOrDef(timestamp, Date.now())

  const senderPublicKey = getSenderPublicKey(seed, paramsOrOrder)

  const { nextSeed } = pullSeedAndIndex(seed)

  const ord: IOrder = {
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
    senderPublicKey,
    proofs,
    id: '',
  }

  raiseValidationErrors(
    generalValidation(ord, validators.IOrder),
    orderValidation(ord)
  )

  const bytes = orderToBytes(ord)

  mapSeed(seed, (s, i) => addProof(ord, signBytes(bytes, s), i))
  ord.id = hashBytes(bytes)

  return nextSeed ? order(ord, nextSeed) : ord
}


