import { publicKey, verifySignature } from "waves-crypto";
import { data } from '../src';
import { dataToBytes } from "../src/transactions/data";

export const dataMinimalParams = {
  data: [
    {
      key: 'someparam',
      value: Uint8Array.from([1, 2, 3, 4])
    }, {
      key: 'someparam2',
      type: 'binary',
      value: 'base64:YXNkYQ=='
    }, {
      key: 'someparam3',
      value: true
    }
  ]
}

describe('data', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = data({ ...dataMinimalParams }as any, stringSeed)
    expect(tx.data.length).toEqual(3)
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should throw on wrong data field type', () => {
    const tx = () => data({ ...dataMinimalParams, data: null } as any, stringSeed)
    const tx1 = () => data({ ...dataMinimalParams, data: { haha: 123 } } as any, stringSeed)
    expect(tx).toThrow(`["data should be array"]`)
    expect(tx1).toThrow(`["data should be array"]`)
  })


  it('Should get correct signature', () => {
    const tx = data({ ...dataMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), dataToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = data({ ...dataMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), dataToBytes(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), dataToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  })
})