import { publicKey, verifySignature } from 'waves-crypto'
import { cancelLease } from '../../src'
import { cancelLeaseToBytes } from '../../src/transactions/cancel-lease'
import { cancelLeaseMinimalParams } from '../minimalParams'

describe('cancel-lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...cancelLeaseMinimalParams })
  })

  it('Should throw on schema validation', () => {
    const tx = () => cancelLease({ ...cancelLeaseMinimalParams, leaseId: null } as any, stringSeed)
    expect(tx).toThrow(`[{
  "keyword": "type",
  "dataPath": ".leaseId",
  "schemaPath": "#/properties/leaseId/type",
  "params": {
    "type": "string"
  },
  "message": "should be string"
}]`)
  })


  it('Should get correct signature', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), cancelLeaseToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), cancelLeaseToBytes(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), cancelLeaseToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  })
})