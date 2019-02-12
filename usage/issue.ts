import { issue } from '../dist/index'

const seed = 'example seed phrase'

const params = {
  name: 'SCAM TOKEN',
  description: 'Awesome token that will tokenize tokenization tokenized',
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