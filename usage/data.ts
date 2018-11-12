import { data } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  data: [
    { key: 'integerVal', value: 1 },
    { key: 'booleanVal', value: true },
    { key: 'stringVal', value: 'hello' },
    { key: 'binaryVal', value: [1, 2, 3, 4] },
  ]
  //timestamp: Date.now(),
  //fee: 100000 + bytes.length * 100000
}

const signedDataTx = data(params, seed)
console.log(signedDataTx)