/**
 * @module index
 */
import {signBytes, blake2b, base58Encode} from '@waves/ts-lib-crypto'
import {addProof, getSenderPublicKey, convertToPairs, isOrder, networkByte} from '../generic'
import {IOrderParams, WithId, WithProofs, WithSender} from '../transactions'
import {TSeedTypes} from '../types'
import {binary} from '@waves/marshall'
import {validate} from '../validators'
import {ExchangeTransactionOrder, SignedIExchangeTransactionOrder} from '@waves/ts-types'
import {orderToProtoBytes} from '../proto-serialize'


/**
 * Creates and signs [[TOrder]].
 *
 * You can use this function with multiple seeds. In this case it will sign order accordingly and will add one proof per seed.
 * Also you can use already signed [[Order]] as a second agrument.
 *
 * ### Usage
 * ```js
 * const { order } = require('@waves/waves-transactions')
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
export function order(paramsOrOrder: IOrderParams, seed: TSeedTypes): SignedIExchangeTransactionOrder<ExchangeTransactionOrder>
export function order(paramsOrOrder: IOrderParams & WithSender | ExchangeTransactionOrder & WithProofs & WithSender, seed?: TSeedTypes): SignedIExchangeTransactionOrder<ExchangeTransactionOrder>
export function order(paramsOrOrder: any, seed?: TSeedTypes): SignedIExchangeTransactionOrder<ExchangeTransactionOrder> {

    const amountAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.amountAsset : paramsOrOrder.amountAsset
    const priceAsset = isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.priceAsset : paramsOrOrder.priceAsset
    const proofs = isOrder(paramsOrOrder) ? paramsOrOrder.proofs : []

    const {matcherFee, matcherPublicKey, price, amount, orderType, expiration, timestamp} = paramsOrOrder
    const t = timestamp || Date.now()

    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = paramsOrOrder.senderPublicKey || getSenderPublicKey(seedsAndIndexes, paramsOrOrder)

    // Use old versionless order only if it is set to null explicitly
    const version = paramsOrOrder.version === null ? undefined : paramsOrOrder.version
    const ord: SignedIExchangeTransactionOrder<ExchangeTransactionOrder> & WithId & WithProofs = {
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
        matcherFeeAssetId: null,
        id: '',
        priceMode: paramsOrOrder.priceMode,
    }

    if (ord.version >= 3) {
        ord.matcherFeeAssetId = paramsOrOrder.matcherFeeAssetId === 'WAVES' ? null : paramsOrOrder.matcherFeeAssetId
    }

    if (ord.version === 4) {
        ord.priceMode = paramsOrOrder.priceMode || 'fixedDecimals'
        // @ts-ignore
        ord.chainId = networkByte(paramsOrOrder.chainId, 87)
        if (paramsOrOrder.eip712Signature) ord.eip712Signature = paramsOrOrder.eip712Signature
    }

    const bytes = ord.version > 3 ? orderToProtoBytes(ord) : binary.serializeOrder(ord)

    seedsAndIndexes.forEach(([s, i]) => addProof(ord, signBytes(s, bytes), i))

    validate.order(ord)

    ord.id = base58Encode(blake2b(bytes))

    // OrderV1 uses signature instead of proofs
    // @ts-ignore
    if (ord.version === undefined || ord.version === 1) (ord as any).signature = ord.proofs && ord.proofs[0]

    return ord
}


