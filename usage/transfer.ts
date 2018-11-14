import { transfer } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

//Transfering 1 WAVES
const params = {
  amount: 100000000,
  recipient: '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs',
  //feeAssetId: undefined
  //assetId: undefined
  //attachment: undefined
  //timestamp: Date.now(),
  //fee: 100000,
}

const signedTransferTx = transfer(params, seed)
console.log(signedTransferTx)