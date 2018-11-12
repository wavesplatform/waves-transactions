import { alias } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  alias: 'MyNewAlias',
  //timestamp: Date.now(),
  //fee: 100000,
  //chainId: 'W',
}

const signedAliasTx = alias(params, seed)
console.log(signedAliasTx)