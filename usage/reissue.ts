import { reissue } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  quantity: 10000,
  assetId: '3toqCSpAHShatE75UFKxqymuWFr8nxuxD7UcLjdxVFLx',
  reissuable: false,
  //timestamp: Date.now(),
  //fee: 100000000,
  //chainId: 'W'
}

const signedReissueTx = reissue(params, seed)
console.log(signedReissueTx)