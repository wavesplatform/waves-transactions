import { publicKey } from '@waves/ts-lib-crypto'
import {cancelLease, ICancelLeaseParams} from '../../src'
import { cancelLeaseMinimalParams } from '../minimalParams'
import { validateTxSignature } from '../../test/utils'

describe('cancel-lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...cancelLeaseMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    tx = cancelLease(tx, stringSeed)
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, [null, stringSeed, null, stringSeed2])

    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  const cancelLeaseTestParams = {
    leaseId: "DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr",
    originTransactionId: "BhHPPHBZpfp8FBy8DE7heTpWGJySYg2uU2r4YM6qaisw",
    sender: "3Mx7kNAFcGrAeCebnt3yXceiRSwru6N3XZd",
    recipient: "3Mz9N7YPfZPWGd4yYaX6H53Gcgrq6ifYiH7",
    amount: 124935000,
    height: 1551763,
    status: "canceled"
  }

  //const leaseId = "DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr"

  it('Should build from minimal set of params check fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  it('Should build from minimal params set fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: 500000 }, stringSeed)
    expect(tx.fee).toEqual(500000)
  })

  it('Should build with complex params', () => {
    const tx = cancelLease({ ...cancelLeaseTestParams }, stringSeed)
    //expect(tx.fee).toEqual(-1)
    expect(tx).toMatchObject({ ...cancelLeaseTestParams })
  })

  it('Should build with negative fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: -1 }, stringSeed)
    expect(tx.fee).toEqual(-1)
  })
})
