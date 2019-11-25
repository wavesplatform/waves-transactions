import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { transfer } from '../../src'
import { transferMinimalParams } from '../minimalParams'
import { binary } from '@waves/marshall'

describe('transfer', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  const privateKey = {privateKey: 'YkoCJDT4eLtCv5ynNAc4gmZo8ELM9bEbBXsEtGTWrCc'}
  it('should build from minimal set of params', () => {
    const tx = transfer({ ...transferMinimalParams } , stringSeed)
    expect(tx).toMatchObject({ ...transferMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = transfer({ ...transferMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct signature via private key', () => {
    const tx = transfer({ ...transferMinimalParams }, privateKey)
    expect(verifySignature(publicKey(privateKey), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = transfer({ ...transferMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })
})
