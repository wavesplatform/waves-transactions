import { publicKey, verifySignature } from 'waves-crypto'
import { massTransfer } from '../src'
import { massTransferToBytes } from '../src/transactions/mass-transfer'

export const massTransferMinimalParams = {
  transfers: [
    {
      recipient: 'aaa',
      amount: 10000,
    },
    {
      recipient: 'aab',
      amount: 10000,
    },
  ],
}

describe('massTransfer', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = massTransfer({ ...massTransferMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...massTransferMinimalParams })
  })

  it('Should throw on transfers not being array', () => {
    const tx = () => massTransfer({ ...massTransferMinimalParams, transfers: null } as any, stringSeed)
    expect(tx).toThrow('["transfers should be array"]')
  })


  it('Should get correct signature', () => {
    const tx = massTransfer({ ...massTransferMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), massTransferToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = massTransfer({ ...massTransferMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), massTransferToBytes(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), massTransferToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  })
})