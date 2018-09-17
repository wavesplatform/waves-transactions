import { issue } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  name: 'SCAM TOKEN',
  description: 'Awesome token that will tokenize tokenization tokenized',
  quantity: 1000000,
  //reissuable: false
  //decimals: 8
  //timestamp: Date.now(),
  //fee: 100000000,
  //chainId: 'W'
}

const signedIssueTx = issue(seed, params)
console.log(signedIssueTx)