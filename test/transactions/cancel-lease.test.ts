import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { cancelLease } from '../../src'
import { cancelLeaseMinimalParams } from '../minimalParams'
import { binary } from '@waves/marshall'

describe('cancel-lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...cancelLeaseMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    tx = cancelLease(tx, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })
})
