import { cancelLease } from '../dist/index'

const seed = 'b716885e9ba64442b4f1263c8e2d8671e98b800c60ec4dc2a27c83e5f9002b18'

const params = {
  leaseId: '2fYhSNrXpyKgbtHzh5tnpvnQYuL7JpBFMBthPSGFrqqg',
  //timestamp: Date.now(),
  //fee: 100000,
  //chainId: 'W'
}

const signedCancelLeaseTx = cancelLease(seed, params)
console.log(signedCancelLeaseTx)