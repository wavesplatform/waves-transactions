import { publicKey } from '@waves/ts-lib-crypto'
import { lease } from '../../src'
import { validateTxSignature } from '../../test/utils'
import { leaseMinimalParams } from '../minimalParams'

describe('lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = lease({ ...leaseMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...leaseMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = lease({ ...leaseMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })


  it('Should sign already signed', () => {
    let tx = lease({ ...leaseMinimalParams }, stringSeed)
    tx = lease(tx, stringSeed)
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = lease({ ...leaseMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })
})
