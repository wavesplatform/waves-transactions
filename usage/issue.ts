import { issue } from '../dist/index'

const seed = 'seed phrase of fifteen words'

const params = {
  name: 'HotPotato TOKEN',
  description: 'It is a gaming token',
  quantity: 1000000,
  //senderPublicKey: 'by default derived from seed',
  //reissuable: false
  //decimals: 8
  //timestamp: Date.now(),
  //fee: 100000000,
  //chainId: 'W'
}

const signedIssueTx = issue(params, seed)
console.log(signedIssueTx)
