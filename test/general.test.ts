import { publicKey, verifySignature } from "waves-crypto";
import { reissue, signTx } from '../src';
import { reissueToBytes } from "../src/transactions/reissue";

export const reissueMinimalParams = {
  assetId: 'test',
  quantity: 10000,
  reissuable: false
}

describe('signTx', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('sign existing transactions', () => {
    const stringSeed2 = 'example seed 2'
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    const signedTwoTimes = signTx(tx, stringSeed2)
    expect(verifySignature(publicKey(stringSeed2), reissueToBytes(signedTwoTimes as any),signedTwoTimes.proofs[1]!)).toBeTruthy()
  })

  it('should throw on no public key or seed', () => {
    const tx = () => reissue({ ...reissueMinimalParams })
    expect(tx).toThrow('Please provide either seed or senderPublicKey')
  })

  it('should throw when index already exists', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    const signedTwoTimes = () => signTx(tx, [stringSeed])
    expect(signedTwoTimes).toThrow('Proof at index 0 is already exists.')
  })
})