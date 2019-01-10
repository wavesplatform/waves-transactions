import { publicKey, verifySignature } from '@waves/waves-crypto'
import { reissue } from '../../src'
import { reissueMinimalParams } from '../minimalParams'
import { binary } from "@waves/marshall";

describe('reissue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = reissue({ ...reissueMinimalParams }as any, stringSeed)
    expect(tx).toMatchObject({ ...reissueMinimalParams })
  });


  it('Should get correct signature', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx),tx.proofs[0]!)).toBeTruthy()
  });

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = reissue({ ...reissueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx),tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx),tx.proofs[3]!)).toBeTruthy()
  })
})