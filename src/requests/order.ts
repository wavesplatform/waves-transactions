import { signBytes, hashBytes } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, isOrder } from '../generic'
import { IOrder, IOrderParams, WithId, WithSender } from '../transactions'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'


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
 */
export function order(paramsOrOrder: IOrderParams, seed: TSeedTypes): IOrder & WithId
export function order(paramsOrOrder: IOrderParams & WithSender | IOrder, seed?: TSeedTypes): IOrder & WithId
export function order(paramsOrOrder: any, seed?: TSeedTypes): IOrder & WithId {

  const amountAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.amountAsset : paramsOrOrder.amountAsset
  const priceAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.priceAsset : paramsOrOrder.priceAsset
  const proofs = isOrder(paramsOrOrder) ? paramsOrOrder.proofs : []

  const { matcherFee, matcherPublicKey, price, amount, orderType, expiration, timestamp } = paramsOrOrder
  const t = timestamp || Date.now()

  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrOrder)

  // Use old versionless order only if it is set to null explicitly
  const version = paramsOrOrder.version === null ? undefined : paramsOrOrder.version || 2
  const ord: IOrder & WithId = {
    orderType,
    version,
    assetPair: {
      amountAsset,
      priceAsset,
    },
    price,
    amount,
    timestamp: t,
    expiration: expiration || t + 29 * 24 * 60 * 60 * 1000,
    matcherFee: matcherFee || 300000,
    matcherPublicKey,
    senderPublicKey,
    proofs,
    id: '',
  }

  const bytes = binary.serializeOrder(ord)

  seedsAndIndexes.forEach(([s,i]) => addProof(ord, signBytes(bytes, s),i))
  ord.id = hashBytes(bytes)

  // for versionless order use signature instead of proofs
  if (ord.version === undefined) (ord as any).signature = ord.proofs[0]

  return ord
}


