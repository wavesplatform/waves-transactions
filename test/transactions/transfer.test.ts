import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { transfer } from '../../src'
import { validateTxSignature } from '../../test/utils'
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
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct signature via private key', () => {
    const tx = transfer({ ...transferMinimalParams }, privateKey)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = transfer({ ...transferMinimalParams }, [null, stringSeed, null, stringSeed2])

    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('Should build with correct fee', () => {
    const tx = transfer({ ...transferMinimalParams } , stringSeed)
     expect(tx.fee).toEqual(100000)
  })

  it('Should build with correct feeAssetId', () => {
    const faId = "DbAik7g5NQcqTPPTiZnr97w4c6jjuahwjeDtTB7tJuQv"
    const tx = transfer({ ...transferMinimalParams, feeAssetId: faId} , stringSeed)
    expect(tx.feeAssetId).toEqual(faId)
  })

  it('Should build with correct attachment', () => {
    const att = "3vrgtyozxuY88J9RqMBBAci2UzAq9DBMFTpMWLPzMygGeSWnD7k"
    const tx = transfer({ ...transferMinimalParams, attachment: att } , stringSeed)
    expect(tx.attachment).toEqual(att)
  })

  it('Should build with null attachment', () => {
    const att = ""
    const tx = transfer({ ...transferMinimalParams, attachment: att } , stringSeed)
    expect(tx.attachment).toEqual(att)
  })

  it('Should build with zero fee', () => {
    const tx = transfer({ ...transferMinimalParams, fee: 0 } , stringSeed)
    expect(tx).toMatchObject({ ...transferMinimalParams })
  })

  it('Should build with negative fee', () => {
    const tx = transfer({ ...transferMinimalParams, fee: -1 } , stringSeed)
    expect(tx).toMatchObject({ ...transferMinimalParams })
  })


})
