import { invokeScript, IInvokeScriptParams, broadcast } from '../dist/index'

const seed = 'create genesis wallet devnet-0'

const params: IInvokeScriptParams = {

  call: {
    args: [{ type: 'integer', value: 1 }],
    //args: [{ type: 'binary', value: '' }],
    //args: [{ type: 'string', value: '' }],
    //args: [{ type: 'boolean', value: '' }],
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

const signedSetScriptTx = invokeScript(params, seed)
console.log(JSON.stringify(signedSetScriptTx))

