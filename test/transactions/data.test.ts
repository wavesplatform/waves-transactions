import { publicKey, verifySignature } from 'waves-crypto'
import { data } from '../../src'
import { dataToBytes } from '../../src/transactions/data'
import { dataMinimalParams } from '../minimalParams'
import { binary } from "@waves/marshall";

describe('data', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = data({ ...dataMinimalParams } as any, stringSeed)
    expect(tx.data.length).toEqual(3)
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should throw on wrong data field type', () => {
    const tx = () => data({ ...dataMinimalParams, data: null } as any, stringSeed)
    const tx1 = () => data({ ...dataMinimalParams, data: { haha: 123 } } as any, stringSeed)
    expect(tx).toThrow('["data should be array"]')
    expect(tx1).toThrow('["data should be array"]')
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

  // Test correct serialization.Compare with value from old data function version
  it('Should correctly serialize', () => {
    const dataParams = {
      data: [
        {
          key: 'oneTwo',
          value: false,
        },
        {
          key: 'twoThree',
          value: 2,
        },
        {
          key: 'three',
          value: Uint8Array.from([1, 2, 3, 4]),
        },
      ],
      timestamp: 100000,
    }
    const tx = data(dataParams, 'seed')
    const barr = '12,1,252,114,65,226,103,96,110,242,73,35,82,18,85,173,252,168,159,237,67,226,116,182,178,180,249,152,104,50,219,208,174,108,0,3,0,6,111,110,101,84,119,111,1,0,0,8,116,119,111,84,104,114,101,101,0,0,0,0,0,0,0,0,2,0,5,116,104,114,101,101,2,0,4,1,2,3,4,0,0,0,0,0,1,134,160,0,0,0,0,0,1,134,160'
    expect(dataToBytes(tx).toString()).toEqual(barr)
  })
})