import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { issue } from '../../src'
import { validateTxSignature } from '../../test/utils'
import { issueMinimalParams } from '../minimalParams'

describe('issue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'
  const protoBytesMinVersion = 2

  it('should build from minimal set of params', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...issueMinimalParams })
  })

  it('should build from minimal set of params with quantity 1', () => {
    const tx = issue({ ...issueMinimalParams, quantity: 1 }, stringSeed)
    expect(tx.fee).toEqual(1000000)
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

    expect(validateTxSignature(tx, protoBytesMinVersion)).toBeTruthy()    
  })

  it('Should get correct signature of NFT token', () => {
    const tx = issue({
      ...issueMinimalParams,
      quantity: 1,
      decimals: 0,
    }, stringSeed)

    expect(validateTxSignature(tx, protoBytesMinVersion)).toBeTruthy()    
  })

  it('Should sign already signed', () => {
    let tx = issue({ ...issueMinimalParams }, stringSeed)
    tx = issue(tx, stringSeed)
    expect(validateTxSignature(tx, protoBytesMinVersion, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = issue({ ...issueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, protoBytesMinVersion, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, protoBytesMinVersion, 3, publicKey(stringSeed2))).toBeTruthy()
  })
})
