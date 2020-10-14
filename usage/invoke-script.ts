import { invokeScript } from '../dist/index'

const seed = 'create genesis wallet devnet-0'

const params = {

  call: {
    args: [{ type: 'integer', value: 1 }],
    //args: [{ type: 'binary', value: 'base64:AAA=' }],
    //args: [{ type: 'string', value: 'foo' }],
    //args: [{ type: 'boolean', value: true }],
    function: 'foo',
  },
  payment: [{
    amount: 7,
    assetId: '73pu8pHFNpj9tmWuYjqnZ962tXzJvLGX86dxjZxGYhoK', //null
  }],
  dApp: '3Fb641A9hWy63K18KsBJwns64McmdEATgJd',
  chainId: 'D',
  fee: 100000,
  feeAssetId: '73pu8pHFNpj9tmWuYjqnZ962tXzJvLGX86dxjZxGYhoK',
  //senderPublicKey: 'by default derived from seed',
  //timestamp: Date.now(),
  //fee: 100000,
  //chainId:
}

const signedInvokeScriptTx = invokeScript(params, seed)
console.log(signedInvokeScriptTx)

