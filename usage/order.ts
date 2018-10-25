import { order } from '../dist/index'

const seed = `c5ef1d4d5cfe42e09b98d085228fd51b5ceb9e48091d4b8fb3888fda65e4fa50`

const params = {
  amount: 100000000, //1 waves
  price: 10, //for 0.00000010 BTC
  priceAsset: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
  matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
  orderType: 'buy'
}

const signedOrder = order(seed, params)
console.log(JSON.stringify(signedOrder))