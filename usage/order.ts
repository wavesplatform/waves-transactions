import { order } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  amount: 100000000, //1 waves
  price: 10, //for 0.00000010 BTC
  priceAsset: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
  matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
  orderType: 'buy',
}

const signedOrder = order(params as any, seed)
console.log(JSON.stringify(signedOrder))