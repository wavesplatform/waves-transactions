import { publicKey, verifySignature } from 'waves-crypto'
import { transfer } from '../../src'
import { transferToBytes } from '../../src/transactions/transfer'
import { transferMinimalParams } from '../minimalParams'

describe('transfer', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = transfer({ ...transferMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...transferMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = transfer({ ...transferMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), transferToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = transfer({ ...transferMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), transferToBytes(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), transferToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  })
})