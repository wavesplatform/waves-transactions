import { alias } from '../dist/index'

const seed = 'example seed phrase'

const params = {
  alias: 'new_alias',
  chainId: 'W',
  //senderPublicKey: 'by default derived from seed',
  //timestamp: Date.now(),
  //fee: 100000,
}

const signedAliasTx = alias(params, seed)
console.log(signedAliasTx)
