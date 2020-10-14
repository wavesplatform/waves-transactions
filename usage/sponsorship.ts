import { sponsorship } from '../dist/index'

const seed = 'example seed phrase'

const params = {
  assetId: '4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC',
  minSponsoredAssetFee: 100,
  //senderPublicKey: 'by default derived from seed',
  //timestamp: Date.now(),
  //fee: 100000,
  //chainId: 'W',
}

const signedSponsorshipTx = sponsorship(params, seed)
console.log(signedSponsorshipTx)