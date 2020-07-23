import { publicKey } from '@waves/ts-lib-crypto'
import { reissue } from '../../src'
import { validateTxSignature } from '../../test/utils'
import { reissueMinimalParams } from '../minimalParams'

describe('reissue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = reissue({ ...reissueMinimalParams }as any, stringSeed)
    expect(tx).toMatchObject({ ...reissueMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = reissue({ ...reissueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })
})
