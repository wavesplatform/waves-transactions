import { publicKey, verifySignature } from '@waves/waves-crypto'
import { issue } from '../../src'
import { issueMinimalParams } from '../minimalParams'
import { binary } from '@waves/marshall'

describe('issue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...issueMinimalParams })
  })

  it('should build with asset script', () => {
    const tx = issue({ ...issueMinimalParams, script:'AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA==' }, stringSeed)
    expect(tx).toMatchObject({ ...issueMinimalParams })
  })

  it('should correctly sed reissuable and decimals', () => {
    const tx = issue({ ...issueMinimalParams, decimals: 0, reissuable:true}, stringSeed)
    expect(tx).toMatchObject({ decimals: 0, reissuable: true})
  })

  it('Should get correct signature', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx),tx.proofs[0]!)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = issue({ ...issueMinimalParams }, stringSeed)
    tx = issue(tx, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = issue({ ...issueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx),tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx),tx.proofs[3]!)).toBeTruthy()
  })
})

//AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA