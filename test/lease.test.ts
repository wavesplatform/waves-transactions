import { publicKey, verifySignature } from 'waves-crypto'
import { lease } from '../src'
import { leaseToBytes } from '../src/transactions/lease'

export const leaseMinimalParams = {
  recipient: 'sssss',
  amount: 10000,
}

describe('lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = lease({ ...leaseMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...leaseMinimalParams })
  })

  it('Should throw on schema validation', () => {
    const tx = () => lease({ ...leaseMinimalParams, recipient: null } as any, stringSeed)
    expect(tx).toThrow(`[{
  "keyword": "type",
  "dataPath": ".recipient",
  "schemaPath": "#/properties/recipient/type",
  "params": {
    "type": "string"
  },
  "message": "should be string"
}]`)
  })


  it('Should get correct signature', () => {
    const tx = lease({ ...leaseMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), leaseToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = lease({ ...leaseMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), leaseToBytes(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), leaseToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  })
})