import { setScript } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  script: 'AQa3b8tH', //true
  //timestamp: Date.now(),
  //fee: 100000,
  //chainId: 'W'
}

const signedSetScriptTx = setScript(params, seed)
console.log(signedSetScriptTx)