import { publicKey, verifySignature } from 'waves-crypto'
import { reissue } from '../src'
import { reissueToBytes } from '../src/transactions/reissue'

export const reissueMinimalParams = {
  assetId: 'test',
  quantity: 10000,
  reissuable: false,
}

describe('reissue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = reissue({ ...reissueMinimalParams }as any, stringSeed)
    expect(tx).toMatchObject({ ...reissueMinimalParams })
  })

  it('Should throw on schema validation', () => {
    const tx = () => reissue({ ...reissueMinimalParams, assetId: null } as any, stringSeed)
    expect(tx).toThrow(`[{
  "keyword": "type",
  "dataPath": ".assetId",
  "schemaPath": "#/properties/assetId/type",
  "params": {
    "type": "string"
  },
  "message": "should be string"
}]`)
  })


  it('Should get correct signature', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), reissueToBytes(tx),tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = reissue({ ...reissueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), reissueToBytes(tx),tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), reissueToBytes(tx),tx.proofs[3]!)).toBeTruthy()
  })
})